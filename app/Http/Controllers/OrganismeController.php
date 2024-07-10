<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Organisme;
use App\Models\AdresseOrganisme;

class OrganismeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    protected $organisme;
    protected $adresseOrganisme;

    public function __construct(){
        $this->organisme = new Organisme();
        $this->adresseOrganisme = new AdresseOrganisme();
    }
    public function index()
    {
        return $this->organisme->with('adresse')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // $organismeData = [
        //     'nomOrganisme' => $request-> nomOrganisme,
        //     'nomContact' => $request-> nomContact,
        //     'prenomContact' => $request-> prenomContact,
        //     'typeOrganisme' => $request-> typeOrganisme,
        //     'telContact' => $request-> telContact,
        //     'emailContact' => $request-> emailContact
        // ];
        // $adresseData = [
        //     'ville' => $request-> ville,
        //     'rue' => $request-> rue,
        //     'region' => $request-> region
        // ];

        $organismeData = $request->only([
            'nomOrganisme',
            'nomContact',
            'prenomContact',
            'typeOrganisme',
            'telContact',
            'emailContact',
        ]);

        $adresseData = $request->only([
            'ville', 'rue', 'region'
        ]);

        try{
            $organisme = $this->organisme->create($organismeData);
            $organisme->adresse()->create($adresseData);

            return response()->json([
                'message' => "l'organisme a été créé avec succès",
              ], 200);

        }catch(Throwable $e){
            return response()->json([
              'message' => "quelque chose s'est mal passé " . $e,
            ], 500);
        }

    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $organisme = $this->organisme->with('adresse')->find($id);
        return $organisme;
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $organisme = $this->organisme->find($id);
        $adresse = $this->adresseOrganisme->find($id);

        try{
            $organisme->update($request->only([
                'nomOrganisme', 'nomContact', 'prenomContact', 'typeOrganisme', 'telContact', 'emailContact'
            ]));
            $adresse->update($request->only([
                'ville', 'rue', 'region'
            ]));

            return response()->json([
                'message' => "L'organisme a été mise à jour avec succès."
              ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé :" . $e,
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try{
            $this->organisme->find($id)->delete();
            return response()->json([
              'message' => "L'organisme a été supprimé avec succès"
            ], 200);
        }catch(Throwable $e){
            return response()->json([
                'message' => "quelque chose s'est mal passé",
              ], 500);
        }
    }
}
