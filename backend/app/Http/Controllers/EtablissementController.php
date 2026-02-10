<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Etablissement;
use App\Models\Organisme;
use App\Models\AdresseOrganisme;

class EtablissementController extends Controller
{
    protected $etablissement;
    protected $organisme;
    protected $adress;

    public function __construct(){
        $this->etablissement = new Etablissement();
        $this->organisme = new Organisme();
        $this->adress = new AdresseOrganisme();
      }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->etablissement->with('organisme.adresse')->first();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $organismeData = [
            'nomOrganisme' => $request-> nomOrganisme,
            'nomContact' => $request-> nomContact,
            'prenomContact' => $request-> prenomContact,
            'typeOrganisme' => $request-> typeOrganisme,
            'telContact' => $request-> telContact,
            'emailContact' => $request-> emailContact
        ];
        $adresseData = [
            'ville' => $request-> ville,
            'rue' => $request-> rue,
            'region' => $request-> region
        ];
        $etablissementData = [
            'logo' => $request->logo
        ];

        try{
            $organisme = $this->organisme->create($organismeData);
            $organisme->adresse()->create($adresseData);
            $organisme->etablissement()->create($etablissementData);

            return response()->json([
                'status' => true,
                'message' => "l'établissementa été créé avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try{
            $organisme = $this->organisme->find($id);
            $adresse = $this->adress->find($id);
            $etab = $this->adress->find($id);

            $organisme->update($request->only([
                'nomOrganisme', 'nomContact', 'prenomContact', 'typeOrganisme', 'telContact', 'emailContact'
            ]));
            $adresse->update($request->only([
                'ville', 'rue', 'region'
            ]));
            $etab->update($request->only(['logo']));

            return response()->json([
                'status' => true,
                'message' => "l'établissementa été miss a jour avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $this->etablissement->find($id)->delete();
            return response()->json([
                'status' => true,
                'message' => "la reclamation a été supprimé avec succès.",
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }
}
