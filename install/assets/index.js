function isSet (n){
    if (n !== undefined && n !== null) {
        return true;
    }
}
function trimFilename(path) {
    return path.substring(path.lastIndexOf("/") + 1);
}
 function appendProgressBartHtml (percent = 0){
    let progressBarContainer = document.querySelector('.progress-bar__wrapper')
    if(isSet(progressBarContainer)){
        progressBarContainer.remove();
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"progress-bar__wrapper container\">\n" +
                "      <span class=\"progress-bar__text\">Загрузка:</span>\n" +
                "  <div class=\"progress-bar__container\">\n" +
                "    <div class=\"progress-bar\" style=\"left: " + (-100 + (percent)) +"%\" >\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>";
        });
    }else{
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"progress-bar__wrapper container\">\n" +
                "      <span class=\"progress-bar__text\">Загрузка:</span>\n" +
                "  <div class=\"progress-bar__container\">\n" +
                "    <div class=\"progress-bar\" style=\"left: " + (-100 + (percent))  +"%\" >\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>";
        });
    }
}
function appendResultContainerHtml (findedCount, convertedCount){
    let resultContainer = document.querySelector('.result__wrapper')
    if(isSet(resultContainer)) {
        resultContainer.remove();
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"result__wrapper container\">\n" +
                "      <label class=\"result__checkbox-wrapper\">Отображать только названия файлов" +
                "      <input type='checkbox'>\n" +
                "      <span class=\"checkmark\"></span>\n" +
                "      </label>\n" +
                "      <p class=\"progress-bar__text\">Найдено: " + findedCount + "</p>\n" +
                "      <p class=\"progress-bar__text\">Конвертировано: " + convertedCount + "</p>\n" +
                "  <ul class=\"result__list scroll-block\">\n" +
                "  </ul>\n" +
                "</div>";
        });
    }else{
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"result__wrapper container\">\n" +
                "      <label class=\"result__checkbox-wrapper\">Отображать только названия файлов" +
                "      <input type='checkbox'>\n" +
                "      <span class=\"checkmark\"></span>\n" +
                "      </label>\n" +
                "      <p class=\"progress-bar__text\">Найдено: " + findedCount + "</p>\n" +
                "      <p class=\"progress-bar__text\">Конвертировано: " + convertedCount + "</p>\n" +
                "  <ul class=\"result__list scroll-block\">\n" +
                "  </ul>\n" +
                "</div>";
        });
    }
}
function appendResultHtml(arr){
    if(arr.length > 5000) {
        $(".result__list").append(function (i) {
            return "<li class=\"result__list-item\">Слишком большое кол-во файлов</li>\n"
        });
    }else{
        for (const [key, value] of Object.entries(arr)) {
            if(key !== 'success'){
                $(".result__list").append(function (i) {
                    return "<li class=\"result__list-item\" data-toggled=\"false\" data-file-path='" + value + "' data-file-name=\n"+  trimFilename(value) +" >\n" + value + "</li>\n"
                });
            }
        }
    }
}
function handleFilesNames(){
    $(document).on('click', '.checkmark', function (e) {
        $('.result__list-item').each(function (index) {
            if($(this).attr('data-toggled') === 'true'){
                $(this).text($(this).attr('data-file-path'));
                $(this).attr('data-toggled', false)
            }else{
                $(this).text($(this).attr('data-file-name'));
                $(this).attr('data-toggled', true)
            }
        })

    })
}
function calculatePercentage(total, available) {
    if (total === 0) {
        return 0; // чтобы избежать деления на ноль
    }
    return (available / total) * 100;
}
function handleButtonLoader (button) {
    button.classList.remove('adm-btn-load')
    button.removeAttribute('disabled')
    $('.adm-btn-load-img-green').remove();
}
document.addEventListener("DOMContentLoaded", function() {
    if (!Object.prototype.length) {
        Object.defineProperty(Object.prototype, 'length', {
            get: function() {
                return Object.keys(this).length
            }
        })
    }
    let convertForm = document.querySelector('.form__convert');
    let convertButton = document.querySelector('.adm-btn-save');
    convertForm.addEventListener('submit', function (e){
        e.preventDefault();
        let responseWrapper = document.querySelector('.files-list-wrapper');
        if(isSet(responseWrapper)) {
            $(".files-list-wrapper").remove();
        }
        var data = $('.form__convert').serializeArray();
        $.ajax({
            url: '',
            method: 'post',
            data: data,
            dataType: 'json',
            success: function(data){
                let response = data;
                if(isSet(response.success)){
                    let upperCounter = parseInt((response.length/100) * 5)
                    if(upperCounter === 0){
                        upperCounter = 1;
                    }
                    let c = 0;
                    for(let i = 0; i < response.length -1; i = i + upperCounter){
                        let counter = i + upperCounter;
                        let iterationData = [];
                        for (const [key, value] of Object.entries(response)) {
                                if((parseInt(key) < counter) && (i <= parseInt(key))){
                                iterationData.push(value);
                            }
                        }
                        $('.form-ajax__action').attr('name', 'ajax_convert_files');
                        $('.form-ajax__action').val(iterationData)
                        iterationData = $('.form__convert').serializeArray();

                        $.ajax({
                            url: '',
                            method: 'post',
                            data: iterationData,
                            dataType: 'json',
                            success: function (res){
                                c = c + res.length
                                appendResultContainerHtml(response.length - 1, c);
                                appendResultHtml(response);
                                handleFilesNames();
                                appendProgressBartHtml(calculatePercentage(response.length - 1, c))
                                if((response.length - 1) === c) {
                                    handleButtonLoader(convertButton) // убираем лоадер с кнопки
                                }
                            }
                        })
                    }
                    $('.form-ajax__action').attr('name', 'ajax_find_files');
                    $('.form-ajax__action').val(1)

                }
            }
        });
    })



});