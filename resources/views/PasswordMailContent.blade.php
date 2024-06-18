<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Informations sur le compte</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .email-header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .email-body {
            padding: 20px;
            color: #333333;
        }
        .email-footer {
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #666666;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            margin-top: 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border-radius: 5px;
            text-decoration: none;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>Informations sur le compte</h1>
        </div>
        <div class="email-body">
            <p>Bonjour! {{ $data['nom'] . ' ' . $data['prenom'] }},</p>
            <p>Votre compte a été créé avec succès. Voici vos identifiants de connexion:</p>
            <p><strong>Email:</strong> {{ $data['email'] }}</p>
            <p><strong>Mot de pass:</strong> {{ $data['password'] }}</p>
        </div>
    </div>
</body>
</html>