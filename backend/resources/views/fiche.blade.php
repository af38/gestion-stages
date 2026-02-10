<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>fiche</title>
    <style>
        .bold{
            font-weight: bold;
        }
        .box{
            padding: 1rem;
            border:1px solid #000
        }
    </style>
</head>
<body>
    <div class="logo-cont">
        <img style="width: 300px; height: 150px"  src="{{'storage/' . $logo}}" alt="logo fste">
    </div>
    <div>
        <h2>LE STAGIAIRE</h2>
        <div class="box">
            <div>
                <span class="bold">Nom & prénom:</span>
                <span>{{'  ' . $student->utilisateur->nom . ' ' . $student->utilisateur->prenom}}</span>
            </div>

            <div>
                <span class="bold">Email:</span>
                <span>{{'  ' .$student->utilisateur->email}}</span>
            </div>

            <div>
                <span class="bold">CNE:</span>
                <span>{{'  ' .$student->cne}}</span>
            </div>

            <div>
                <span class="bold">Téléphone:</span>
                <span>{{'  ' .$student->utilisateur->numTel}}</span>
            </div>

            <div>
                <span class="bold">Date de naissance:</span>
                <span>{{'  ' .$student->dateNaissance}}</span>
            </div>

            <div>
                <span class="bold">Filière:</span>
                <span>{{'  ' .$student->filiere}}</span>
            </div>

            <div>
                <span class="bold">Spécialité:</span>
                <span>{{'  ' .$student->specialite}}</span>
            </div>

        </div>

        <h2>L'ORGANISME D'ACCUEIL </h2>
        <div class="box">

            <div>
                <span class="bold">Nom:</span>
                <span>{{'  ' .$organisme->nomOrganisme}}</span>
            </div>

            <div>
                <span class="bold">type:</span>
                <span>{{'  ' .$organisme->typeOrganisme}}</span>
            </div>

            <div>
                <span class="bold">Adresse:</span>
                <span>{{'  ' .$organisme->adresse->region . ' ' . $organisme->adresse->ville . ' ' . $organisme->adresse->rue}}</span>
            </div>

            <div>
                <span class="bold">Téléphone:</span>
                <span>{{'  ' . $organisme->telContact}}</span>
            </div>

            <div>
                <span class="bold">Email:</span>
                <span>{{'  ' . $organisme->emailContact}}</span>
            </div>

            <div>
                <span class="bold">Représenté par:</span>
                <span>{{'  ' . $organisme->nomContact . ' ' . $organisme->prenomContact}}</span>
            </div>

        </div>

        <h2>AFFECTATION DU STAGIAIRE</h2>
        <div class="box">
            <span class="bold">Période de stage:</span>
            <span>du {{$stage->dateDebut}} au {{$stage->dateFin}}</span>
            <span>Encadrant de stage :</span>
            <br>
            <div>
                <span class="bold">Nom & prénom:</span>
                <span>{{$teacher->utilisateur->nom . ' ' , $teacher->utilisateur->prenom}}</span>
            </div>
            <div>
                <span class="bold">email:</span>
                <span> {{ $teacher->utilisateur->email}}</span>
                <br>
                <span class="bold">telephone:</span>
                <span> {{ $teacher->utilisateur->numTel}}</span>
            </div>
        </div>

        <h2>FICHE TECHNIQUE</h2>
        <div class="box">
            <div>
                <span class="bold">L’intitulé du sujet proposé :</span>
                <span>{{$stage->intitule}}</span>
            </div>

            <div>
                <span class="bold">Description du sujet proposé :</span>
                <span>{{$stage->descriptif}}</span>
            </div>
        </div>
    </div>

    <section style="margin-top: 1rem">
        <br>
        <span>Pour le Responsable du stage: </span>
        <br>
        <p>Signature</p>

    </section>

</body>
</html>