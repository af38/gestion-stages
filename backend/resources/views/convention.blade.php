<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <style>
        .student-info{
            width: 50%;
        }
        .student-info div{
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .student-info div span:first-of-type{
            font-weight: bold;
        }
        h2{
            background: lightgray;
            padding: .5rem;
        }
    </style>
    <title>convention</title>
</head>
<body>
    <div class="logo-cont">
        <img style="width: 300px; height: 150px"  src="{{'storage/' . $logo}}" alt="logo fste">
    </div>
    <h1 style="text-align: center">Convention de stage</h1>

    {{-- studnet --}}
    <h2>Stagiare</h2>
    <div class="student-info">

        <div>
            <span>Nom & prénom:</span>
            <span>{{'  ' . $student->utilisateur->nom . ' ' . $student->utilisateur->prenom}}</span>
        </div>

        <div>
            <span>Email:</span>
            <span>{{'  ' .$student->utilisateur->email}}</span>
        </div>

        <div>
            <span>CNE:</span>
            <span>{{'  ' .$student->cne}}</span>
        </div>

        <div>
            <span>Téléphone:</span>
            <span>{{'  ' .$student->utilisateur->numTel}}</span>
        </div>

        <div>
            <span>Date de naissance:</span>
            <span>{{'  ' .$student->dateNaissance}}</span>
        </div>

        <div>
            <span>Filière:</span>
            <span>{{'  ' .$student->filiere}}</span>
        </div>

        <div>
            <span>Spécialité:</span>
            <span>{{'  ' .$student->specialite}}</span>
        </div>

    </div>

    {{-- organisme --}}
    <h2>L'ORGANISME D'ACCUEIL </h2>
    <div class="student-info">

        <div>
            <span>Nom:</span>
            <span>{{'  ' .$organisme->nomOrganisme}}</span>
        </div>

        <div>
            <span>type:</span>
            <span>{{'  ' .$organisme->typeOrganisme}}</span>
        </div>

        <div>
            <span>Adresse:</span>
            <span>{{'  ' .$organisme->adresse->region . ' ' . $organisme->adresse->ville . ' ' . $organisme->adresse->rue}}</span>
        </div>

        <div>
            <span>Téléphone:</span>
            <span>{{'  ' . $organisme->telContact}}</span>
        </div>

        <div>
            <span>Email:</span>
            <span>{{'  ' . $organisme->emailContact}}</span>
        </div>

        <div>
            <span>Représenté par:</span>
            <span>{{'  ' . $organisme->nomContact . ' ' . $organisme->prenomContact}}</span>
        </div>

    </div>

    <article>
        <h2><span>article 1</span>: Projet pédagogique et missions du stagiaire</h2>
        <p>
            Le stage s'inscrit dans le cadre d'un projet pédagogique, mais aussi dans un projet personnel et professionnel et a ainsi pour but de préparer l'étudiant à la vie active.
            {{$student->nom . ' ' . $student->prenom}} stagiaire à {{$organisme->nomOrganisme}} effectuera les missions suivantes :
            <br>
            <p>
                {{$stage->objectif}}
            </p>

        </p>
    </article>

    <article>
        <h2>Durée du stage </h2>
        <p>
            Le stage débutera le {{$stage->dateDebut}} et prendra fin le {{$stage->dateFin}}.
        </p>
    </article>

    <article>
        <h2> Modalités d'encadrement</h2>
        <p>
            •	Le tuteur {{$teacher->utilisateur->nom . ' ' , $teacher->utilisateur->prenom}} devra suivre le déroulement du stage. Il est le référent sur lequel l'étudiant stagiaire peut se tourner en cas de problème. C'est également lui qui encadrera la rédaction du rapport de stage.
        </p>
    </article>

    <article>
        <h2>Assurance responsabilité civile</h2>
        <p>L'étudiant stagiaire a pour obligation de souscrire une assurance responsabilité civile dans le cadre de son stage et fournir une attestation.</p>
    </article>

    <article>
        <h2>Discipline</h2>
        <p>
            Pendant toute la durée du stage, la discipline et le respect du règlement intérieur de l'Entreprise s'imposent au stagiaire. Cela comprend les horaires, les normes d'hygiène et de sécurité applicables dans l'entreprise.
            En l'absence de respect de la discipline ou du règlement intérieur, l'entreprise en informe l’Établissement d'enseignement. Seul ce dernier a compétence pour sanctionner le stagiaire.
            L’entreprise a la faculté de mettre fin au stage de l'étudiant en cas de manquement disciplinaire grave dans le respect de la procédure stipulée à l'article 11 de la présente convention de stage.
        </p>
    </article>

    <article>
        <h2>Absence, suspension, résiliation du stage</h2>
        <p>
            L'étudiant stagiaire peut profiter de congés lors de sa période de stage à condition que la durée minimale du stage ait été respectée.
            L’établissement d'enseignement est averti par l'Entreprise dans les cas suivants :

            <ul>
                <li>maladie du stagiaire</li>
                <li>absence injustifiée </li>
                <li>maternité, etc</li>
            </ul>

            Si l'une des parties (à savoir l’Établissement d'enseignement, l'Entreprise, l'étudiant) souhaite une interruption définitive du stage, une information écrite devra être transmise aux deux autres parties.
            </p>
    </article>

    <section style="border: 1px solid #000; padding: 1rem;">
        <br><br><br><br>
        <span>signature de l'étudiant: </span>
        <br><br><br><br>
        <span>signature du représentant de l'organisme d'accueil & cachet de l'organisme</span>
        <br><br><br><br>
        <span>signature du représentant de l'établissement d'enseignement & cachet de l'établissement:</span>
        <br><br><br><br>
    </section>

</body>
</html>
