<?
defined('B_PROLOG_INCLUDED') and (B_PROLOG_INCLUDED === true) or die();
// пространство имен для подключений ланговых файлов
use Bitrix\Main\Localization\Loc;
// подключение ланговых файлов
Loc::loadMessages(__FILE__);
// основной массив $aMenu
$aMenu = array(
    // оснавная ветка меню
    array(
        // пункт меню в разделе Контент
        'parent_menu' => 'global_menu_services',
        // сортировка
        'sort' => 1,
        // название пункта меню
        'text' => "WebpConvert",
        // идентификатор ветви
        "items_id" => "menu_webforms",
        // иконка
        "icon" => "form_menu_icon",
        // дочерния ветка меню
        'items' => array(
            array(
                // название подпункта меню
                'text' => 'Модуль WebpConvert',
                // ссылка для перехода
                'url' => 'settings.php?lang=ru&mid=webpconvert.d7',
            ),
        )
    ),
);
// возвращаем основной массив $aMenu
return $aMenu;
