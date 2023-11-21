<?php
// пространство имен для класса Test
namespace WebpConvert\Main;
// пространство имен для подключения класса


class Main
{
    function __construct(){}
    public static function webpConvert($file, $compression_quality = 80){
        if (!file_exists($file)) {
            return false;
        }
        $file_type = exif_imagetype($file);
        $output_file =  explode('.', $file)[0] . '.webp';
        if (file_exists($output_file)) {
            return $output_file;
        }
        if (function_exists('imagewebp')) {
            switch ($file_type) {
                case '1': //IMAGETYPE_GIF
                    $image = imagecreatefromgif($file);
                    break;
                case '2': //IMAGETYPE_JPEG
                    $image = imagecreatefromjpeg($file);
                    break;
                case '3': //IMAGETYPE_PNG
                    $image = imagecreatefrompng($file);
                    imagepalettetotruecolor($image);
                    imagealphablending($image, true);
                    imagesavealpha($image, true);
                    break;
                case '6': // IMAGETYPE_BMP
                    $image = imagecreatefrombmp($file);
                    break;
                case '15': //IMAGETYPE_Webp
                    return false;
                    break;
                case '16': //IMAGETYPE_XBM
                    $image = imagecreatefromxbm($file);
                    break;
                default:
                    return false;
            }
            // Save the image
            $result = imagewebp($image, $output_file, $compression_quality);
            if (false === $result) {
                return false;
            }
            // Free up memory
            imagedestroy($image);
            return $output_file;
        } elseif (class_exists('Imagick')) {
            $image = new Imagick();
            $image->readImage($file);
            if ($file_type === "3") {
                $image->setImageFormat('webp');
                $image->setImageCompressionQuality($compression_quality);
                $image->setOption('webp:lossless', 'true');
            }
            $image->writeImage($output_file);
            return $output_file;
        }
        return false;
    }
    /**
     * Поиск файла по имени во всех папках и подпапках
     * @param  string  $folderName - путь до папки
     * @param  array  $fileType   - искомый файл
     * @return array   Массив найденных файлов.
     */
    public static function searchFile($folderName,$fileType){
        $found = array();
        $folderName = rtrim( $folderName, '/' );
        $dir = opendir( $folderName ); // открываем текущую папку
        // перебираем папку, пока есть файлы
        while( ($file = readdir($dir)) !== false ){
            $file_path = "$folderName/$file";
            if( $file == '.' || $file == '..' ) continue;
            // это файл проверяем имя
            if( is_file($file_path) ){
                // если имя файла искомое, то вернем путь до него
                foreach ($fileType as $fileItem){
                    if( false !== strpos($file, $fileItem)){
                        $found[] = $file_path;
                    }
                }
            }
            // это папка, то рекурсивно вызываем search_file
            elseif( is_dir($file_path) ){
                $res = self::searchFile( $file_path, $fileType );
                $found = array_merge( $found, $res );
            }
        }
        closedir($dir); // закрываем папку
        return $found;
    }

    public function findAndConvert ($folderPath, $filesTypes){
        $foundedFiles = self::searchFile( $folderPath, $filesTypes );
        if($foundedFiles !== 0 ){
            $foundedFiles['success'] = 'Файлы найдены';
            echo json_encode($foundedFiles, JSON_UNESCAPED_UNICODE);
            return;
            echo 'start/';
            foreach ($foundedFiles as $files) {
                if(self::webpConvert($files)){
                    print_r(self::getFileName($files));
                }
            }
            echo '/end';
        }
    }
    public static function getFileName($filePath) {
        $ex = explode('/', $filePath);
        return end($ex) . '/';
    }
}
