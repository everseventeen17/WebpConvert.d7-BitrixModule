<?
// пространство имен для подключений ланговых файлов
use Bitrix\Main\Localization\Loc;
// подключение ланговых файлов
Loc::loadMessages(__FILE__);
// метод возвращает объект класса CApplicationException, содержащий последнее исключение
if ($errorException = $APPLICATION->getException()) {
    // вывод сообщения об ошибке при удалении модуля
    CAdminMessage::showMessage(
        Loc::getMessage('DEINSTALL_FAILED') . ': ' . $errorException->GetString()
    );
} else {
    // вывод уведомления при успешном удалении модуля
    CAdminMessage::showNote(
        Loc::getMessage('DEINSTALL_SUCCESS')
    );
}
?>
<!-- Кнопка возврата к списку модулей -->
<form action="<?= $APPLICATION->getCurPage(); ?>">
    <input type="submit" value="<?= Loc::getMessage('RETURN_MODULES'); ?>">
</form>