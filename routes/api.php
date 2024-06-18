<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


use App\Http\Controllers\UtilisateurController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\RespController;
use App\Http\Controllers\EnseignantController;

use App\Http\Controllers\StageController;
use App\Http\Controllers\OrganismeController;
use App\Http\Controllers\AdresseController;

use App\Http\Controllers\ReclamationController;

use App\Http\Controllers\RapportController;
use App\Http\Controllers\CommissionController;

use App\Http\Controllers\StageDeposeController;
use App\Http\Controllers\AuthController;

use App\Http\Controllers\ExportController;
use App\Http\Controllers\pdfController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\EtablissementController;


Route::get('/user', function (Request $request) {
    return $request->user();
});

Route::apiResource('/etudiant', StudentController::class);
Route::get('/etudiant/isIntern/{id}', [StudentController::class, 'isIntern']);
Route::get('/etudiants/filieres', [StudentController::class, 'getDistinctFilieres']);
//get disafected students
Route::get('/etudiants/disafected', [StudentController::class, 'getDisaffectedStudents']);
// get student stage histor
Route::get('/etudiants/getHistory', [StudentController::class, 'getHistory']);



// Route::get('/etudiant/search/{query}', [StudentController::class, 'search']);
// search etudiants
Route::get('/etudiants/search', [SearchController::class, 'searchStudents']);

// search reps //delete in resp controllers
Route::get('/resps/search', [SearchController::class, 'searchResps']);
//search teachers
// Route::get('/enseignant/search/{query}', [EnseignantController::class, 'search']);
Route::get('/enseignant/search', [SearchController::class, 'searchTeachers']);

//search organismes
Route::get('/organisme/search', [SearchController::class, 'searchOrganismes']);
//search commissions
Route::get('/commission/search/{query}', [SearchController::class, 'searchComms']);
//search reclmations
Route::get('/reclamations/search', [SearchController::class, 'searchReclamations']);
//search stages
Route::get('/stages/search', [SearchController::class, 'searchStages']);
Route::get('/stagesNormale/search', [SearchController::class, 'searchNormaleStages']);

//search rapports
Route::get('/rapportes/search', [SearchController::class, 'searchRapport']);



Route::apiResource('/admin', AdminController::class);
Route::apiResource('/resp', RespController::class);

Route::apiResource('/enseignant', EnseignantController::class);
Route::get('/enseignant/isMember/{id}', [EnseignantController::class, 'isMember']);
Route::get('/enseignantt/departements', [EnseignantController::class, 'getDistinctDepatments']);

Route::apiResource('/stage', StageController::class);
Route::get('/getAuthStagairesNumber/{id}', [StageController::class, 'getAuthStagairesNumber']);
Route::apiResource('/organisme', OrganismeController::class);
Route::apiResource('/adresse', AdresseController::class);

Route::apiResource('/reclamation', ReclamationController::class);

// get all reclamtions (not canceled) with student and teacher informations
Route::get('/getRespReclamations', [ReclamationController::class, 'getRespReclamations']);

// get reclamation that were made by a teacher
Route::get('/reclmationsByEns/{id}', [ReclamationController::class, 'reclmationsByEns']);


// affectation
Route::post('/affectation', [StageController::class, 'affectation']);
Route::delete('/dissafecterEtudiant/{id}', [StageController::class, 'dissafecterStudent']);


Route::apiResource('/rapport', RapportController::class);
Route::apiResource('/commission', CommissionController::class);
Route::post('/commission/rejoindre', [CommissionController::class, 'rejoindre']);
Route::delete('/commission/disaffecter/{teacherId}', [CommissionController::class, 'disaffecter']);
Route::get('/commission/commByTeacher/{id}', [CommissionController::class, 'commByTeacher']);

// // depose stages
// Route::post('/depose', [StageController::class, 'deposer']);
// //get stages deposes
// Route::get('/stagesdeposes/{id}', [StageController::class, 'getStagesDeposes']);
// Route::get('/allstagesdeposes', [StageController::class, 'getAllStagesDeposes']);

// stages encadres par une enseignant
Route::get('/enseignantStages/{id}', [StageController::class, 'enseignantStages']);

//etudiant encadres par une enseignant
Route::get('/etudiantsDeEns/{id}', [StageController::class, 'etudiantsDeEns']);

//etudiant passer une stage
Route::get('/etudiantsparstage/{id}', [StageController::class, 'etudiantsParStage']);

//stage by student id: to display in student-home page
Route::get('/stageparetudiantid/{id}', [StageController::class, 'stageByStudentId']);


Route::apiResource('/deposer', StageDeposeController::class);
//accepted deposed stages
Route::get('/deposee/accepted', [StageDeposeController::class, 'getAcceptedStages']);
//accept and refuse stage
Route::get('/deposee/accept', [StageDeposeController::class, 'accepter']);
Route::get('/deposee/refuse', [StageDeposeController::class, 'refuser']);
// Route::get('/deposer/refuse', [StageDeposeController::class]);


Route::apiResource('/etablissement', EtablissementController::class);


//login
Route::post('/login', [AuthController::class, 'login']);

// export DB
Route::get('/export', [ExportController::class, 'export']);
// get tables
Route::get('/getTables', [ExportController::class, 'getTables']);
// import a tables
Route::post('/import/{table}', [ExportController::class, 'import']);

//conventin pdf
Route::get('/convention/{id}', [pdfController::class, 'convention']);
Route::get('/fiche/{id}', [pdfController::class, 'fiche']);

// seance d'incadremets
Route::apiResource('/seance', App\Http\Controllers\SeanceEncadrementController::class);
//get seances by student id
Route::get('/etudiant/seances/{id}', [StudentController::class, 'seancesByStudentId']);
// get seances by teacher id
Route::get('/teacher/seances/{id}', [EnseignantController::class, 'seancesByTeacherId']);
//set note
Route::post('/teacher/setnote', [EnseignantController::class, 'setNote']);


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
// ->middleware('auth:sanctum')
//INFO  API scaffolding installed. Please add the [Laravel\Sanctum\HasApiTokens] trait to your User model.
