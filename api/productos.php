<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

$productos = [
    [
        "id" => 1,
        "nombre" => "Sudadera \"Ctrl + Z\"",
        "precio" => 599,
        "descripcion" => "Para cuando necesitas deshacer tus errores del día.",
        "categoria" => "SUDADERAS"
    ],
    [
        "id" => 2,
        "nombre" => "Taza \"Fixing Bug\"",
        "precio" => 249,
        "descripcion" => "Líquido vital para compilar sin advertencias.",
        "categoria" => "ACCESORIOS"
    ],
    [
        "id" => 3,
        "nombre" => "Playera \"Senior Dev\"",
        "precio" => 349,
        "descripcion" => "No es magia, es experiencia acumulada.",
        "categoria" => "PLAYERAS"
    ]
];

echo json_encode($productos);
?>