<?php
// пространство имен для подключений ланговых файлов
use Bitrix\Main\Localization\Loc;
// пространство имен для получения ID модуля
use Bitrix\Main\HttpApplication;
// пространство имен для загрузки необходимых файлов, классов, модулей
use Bitrix\Main\Loader;
// пространство имен для работы с параметрами модулей хранимых в базе данных
use Bitrix\Main\Config\Option;

/*подключение js or css*/
$ajaxFolder = '/local/modules/webpconvert.d7/lib/';
$fileType   = ["jpg", "png"];
$arJsConfig = array(
    'custom_main' => array(
        'js' => '/local/modules/webpconvert.d7/install/assets/index.js',
        'css' => '/local/modules/webpconvert.d7/install/assets/index.css',
        'rel' => array(),
    ),
    'jq' => array(
        'js' => '/local/modules/webpconvert.d7/install/assets/jquery-3.4.1.min.js',
        'rel' => array(),
    ),
);
foreach ($arJsConfig as $ext => $arExt) {
    \CJSCore::RegisterExt($ext, $arExt);
}
CUtil::InitJSCore(array('custom_main'));
CUtil::InitJSCore(array('jq'));

// подключение ланговых файлов
Loc::loadMessages(__FILE__);

// получаем id модуля
$request = HttpApplication::getInstance()->getContext()->getRequest();
$module_id = htmlspecialcharsbx($request["mid"] != "" ? $request["mid"] : $request["id"]);

// подключение модуля
Loader::includeModule($module_id);

// проверяем текущий POST запрос и сохраняем выбранные пользователем настройки
if ($request->isAjaxRequest()) {
    if(isset($_POST['ajax_find_files'])){
        $path = $_POST['webp_text_path'];
        $fileTypeArray = [$_POST['ajax_file_type_jpg'], $_POST['ajax_file_type_png']];
        $result = \WebpConvert\Main\Main::searchFile($path, $fileType);
        if($result !== 0 ){
            $result['success'] = 'Файлы найдены';
            echo json_encode($result, JSON_UNESCAPED_UNICODE);
        }
    }
    if(isset($_POST['ajax_convert_files'])){
        $filesToConvert = explode(',', $_POST['ajax_convert_files']);
        foreach ($filesToConvert as $file) {
            if(\WebpConvert\Main\Main::webpConvert($file)){
                echo \WebpConvert\Main\Main::getFileName($file);
            }
        }
    }
    die();
}
// настройки модуля для админки в том числе значения по умолчанию
$referer_url = $_SERVER["HTTP_REFERER"];
$arUrl = parse_url($referer_url);
$arUrl = explode('.',$arUrl['host']);
if(count($arUrl) === 3){
    $siteFolderName = $arUrl[1];
}elseif(count($arUrl) === 2){
    $siteFolderName = $arUrl[0];
}
$aTabs = array(
    array(
        // значение будет вставленно во все элементы вкладки для идентификации
        "DIV" => "edit",
        // название вкладки в табах 
        "TAB" => "Главная",
        // название вкладки в админке
        "TITLE" => "Конвертация изображений",
        // массив с опциями секции
        "OPTIONS" => array(
            "Путь до папки с изображениями",
            array(
                // имя элемента формы
                "webp_text_path",
                // поясняющий текст
                "Путь:",
                // значение text по умолчанию "50"
                $_SERVER['DOCUMENT_ROOT'] . "/local/templates/" . $siteFolderName . "/images/content/404",
                // тип элемента формы "text"
                array("text", 100)
            ),
        )
    ),
);



// отрисовываем форму, для этого создаем новый экземпляр класса CAdminTabControl, куда и передаём массив с настройками
$tabControl = new CAdminTabControl(
    "tabControl",
    $aTabs
);

// отображаем заголовки закладок
$tabControl->Begin();
?>
    <form class="form__convert" action="<? echo ($APPLICATION->GetCurPage()); ?>?mid=<? echo ($module_id); ?>&lang=<? echo (LANG); ?>" method="post">
        <? foreach ($aTabs as $aTab) {
            if ($aTab["OPTIONS"]) {
                // завершает предыдущую закладку, если она есть, начинает следующую
                $tabControl->BeginNextTab();
                // отрисовываем форму из массива
                __AdmSettingsDrawList($module_id, $aTab["OPTIONS"]);
            }
        }
        // выводит стандартные кнопки отправки формы
        $tabControl->Buttons();
        // выводим скрытый input с идентификатором сессии
        echo (bitrix_sessid_post()); ?>
        <input class="adm-btn-save" type="submit" name="apply" value="Найти" />
        <input  type="hidden" class="form-ajax__action" name="ajax_find_files" value='<?= true ?>' />
        <? foreach ($fileType as $key=> $value){ ?>
            <input  type="hidden" name="ajax_file_type_<?= $value; ?>" value='<?= $value; ?>' />
        <?}?>
    </form>




<?
// обозначаем конец отрисовки формы
$tabControl->End();
