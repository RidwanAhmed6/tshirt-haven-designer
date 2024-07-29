<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Extract data from POST request
    $designImage = $_POST['designImage'];
    $textInput = $_POST['textInput'];
    $quantity = $_POST['quantity'];
    $name = $_POST['name'];
    $mobile = $_POST['mobile'];
    $address = $_POST['address'];
    $note = $_POST['note'];

    // Handle file uploads
    $uploadedPhotos = [];
    if (!empty($_FILES['uploadedPhotos']['name'][0])) {
        foreach ($_FILES['uploadedPhotos']['name'] as $key => $name) {
            $tmp_name = $_FILES['uploadedPhotos']['tmp_name'][$key];
            $uploadDir = 'uploads/';
            $uploadFile = $uploadDir . basename($name);
            if (move_uploaded_file($tmp_name, $uploadFile)) {
                $uploadedPhotos[] = $uploadFile;
            }
        }
    }

    // Construct email body
    $emailBody = "
    Design Image: $designImage\n
    Text Input: $textInput\n
    Quantity: $quantity\n
    Name: $name\n
    Mobile Number: $mobile\n
    Address: $address\n
    Note: $note\n
    Uploaded Photos:\n" . implode("\n", $uploadedPhotos);

    // Prepare email
    $to = 'tshirthaven.bd@gmail.com'; // Replace with your email
    $subject = 'New T-shirt Order';
    $headers = "From: no-reply@example.com\r\n";
    $headers .= "Reply-To: no-reply@example.com\r\n";

    // Send email
    if (mail($to, $subject, $emailBody, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
