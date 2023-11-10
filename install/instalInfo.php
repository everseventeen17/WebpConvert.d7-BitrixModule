<?
// пространство имен для подключений ланговых файлов
use Bitrix\Main\Localization\Loc;
// подключение ланговых файлов
Loc::loadMessages(__FILE__);
// метод возвращает объект класса CApplicationException, содержащий последнее исключение
if ($errorException = $APPLICATION->getException()) {
    // вывод сообщения об ошибке при установке модуля
    CAdminMessage::showMessage(
        Loc::getMessage('INSTALL_FAILED') . ': ' . $errorException->GetString()
    );
} else {
    // вывод уведомления при успешной установке модуля
    CAdminMessage::showNote(
        Loc::getMessage('INSTALL_SUCCESS')
    );
}
?>
<!-- Кнопка возврата к списку модулей -->
<form action="<?= $APPLICATION->getCurPage(); ?>">
    <input type="submit" value="<?= Loc::getMessage('RETURN_MODULES'); ?>">
</form>