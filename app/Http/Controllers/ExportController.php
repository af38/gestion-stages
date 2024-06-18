<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Rap2hpoutre\FastExcel\FastExcel;
use Rap2hpoutre\FastExcel\SheetCollection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Response;
use ZipArchive;

use App\Models\Utilisateur;
use App\Models\Organisme;

class ExportController extends Controller
{

        public function export(){
            $zipFileName = "gestion-stages-DB.zip";
            $zip = new ZipArchive;
            $tempZipFilePath = tempnam(sys_get_temp_dir(), 'zip');

            try {
                if ($zip->open($tempZipFilePath, ZipArchive::CREATE) !== true) {
                    throw new Exception("Échec de la création de l'archive zip");
                }

                $tables = DB::select('SHOW TABLES');

                foreach ($tables as $tableName) {
                    $tableName = current($tableName);
                    $data = DB::table($tableName)->get();
                    ob_start();
                    (new FastExcel($data))->export('php://output');
                    $excelContent = ob_get_clean();
                    $zip->addFromString("{$tableName}.xlsx", $excelContent);
                }

                $zip->close();
                $fileContent = file_get_contents($tempZipFilePath);
                unlink($tempZipFilePath);
                return response($fileContent)
                    ->header('Content-Type', 'application/zip')
                    ->header('Content-Disposition', "attachment; filename=$zipFileName");

            } catch (\Exception $e) {
                return response("Erreur lors de la création de l'archive zip: " . $e->getMessage(), 500);
            }
        }

    // to be deleted
    private function arrayToCsv(array $array){
            $output = fopen('php://temp', 'w');

            foreach ($array as $row) {
                fputcsv($output, (array)$row);
            }

            rewind($output);
            $csv = stream_get_contents($output);
            fclose($output);

            return $csv;
    }

    public function getTables(){
        $excludeTables=['migrations', 'cache', 'cache_locks', 'failed_jobs', 'jobs', 'job_batches', 'password_reset_tokens', 'personal_access_tokens'];
        // Get all table names using SHOW TABLES
        $tables = DB::select('SHOW TABLES');

        // The key for the table name depends on the database name
        $databaseName = env('DB_DATABASE');
        $key = 'Tables_in_' . $databaseName;

        // Extract table names from the result and filter out the excluded tables
        $allTables = array_map(function($table) use ($key) {
            return $table->$key;
        }, $tables);

        $filteredTables = array_filter($allTables, function ($table) use ($excludeTables) {
            return !in_array($table, $excludeTables);
        });

        return array_values($filteredTables); // Re-index the array
    }

    public function import(Request $request, string $table){

        $columns = Schema::getColumnListing($table);

        $file = $request->file('file');

        $importedData = (new FastExcel)->import($file, function ($line) use ($table, $columns) {
            $data = [];

            foreach ($columns as $column) {
                if (isset($line[$column])) {
                    $data[$column] = $line[$column];
                }
            }

            return DB::table($table)->insert($data);
        });

        return response()->json(['message' => 'Données importées avec succès'], 200);
    }
}


