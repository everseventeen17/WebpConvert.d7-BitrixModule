function isSet (n){
    if (n !== undefined && n !== null) {
        return true;
    }
}
function trimFilename(path) {
    return path.substring(path.lastIndexOf("/") + 1);
}

function appendResultHtml (filePathsArray, convertedFiles){
    $("#edit_edit_table").parent().append(function (i) {
        return "<div class=\"files-list-wrapper\"></div>";
    });
    $(".files-list-wrapper").append(function (i) {
        return "<p>Найдено:" + filePathsArray.length + " шт.</p>" +
            "<ul class=\"files-list\"></ul>";
    });
    filePathsArray.forEach((item, index)=>{
        if(convertedFiles.includes(trimFilename(item))){
            $(".files-list").append(function (i) {
                return "<li class=\"files-list-item\">" + item + " <span class='success'>Конвертировано</span></li>";
            });
        }else{
            $(".files-list").append(function (i) {
                return "<li class=\"files-list-item\">" + item + " <span class='error'>Ошибка</span></li>";
            });
        }

    })
}
 function appendProgressBartHtml (){
    let progressBarContainer = document.querySelector('.progress-bar__wrapper')
    if(isSet(progressBarContainer)){
        progressBarContainer.remove();
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"progress-bar__wrapper container\">\n" +
                "      <span class=\"progress-bar__text\">Загрузка:</span>\n" +
                "  <div class=\"progress-bar__container\">\n" +
                "    <div class=\"progress-bar\">\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>";
        });
    }else{
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"progress-bar__wrapper container\">\n" +
                "      <span class=\"progress-bar__text\">Загрузка:</span>\n" +
                "  <div class=\"progress-bar__container\">\n" +
                "    <div class=\"progress-bar\">\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>";
        });
    }
}
function appendResultContainerHtml (count){
    let resultContainer = document.querySelector('.result__wrapper')
    if(isSet(resultContainer)) {
        resultContainer.remove();
        $("#edit_edit_table").parent().append(function (i) {
            return "<div class=\"result__wrapper container\">\n" +
                "      <p class=\"progress-bar__text\">Конвертировано: " + count + "</p>\n" +
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
                "      <p class=\"progress-bar__text\">Конвертировано: " + count + "</p>\n" +
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
                    return "<li class=\"result__list-item\" data-toggled=\"false\" data-file-path=\n"+  value +" data-file-name=\n"+  trimFilename(value) +" >\n" + value + "</li>\n"
                });
            }
        }
    }
}
function handleFilesNames(value){
    $(document).on('click', '.checkmark', function (e) {
        console.log(e.target)
        $('.result__list-item').each(function (index) {
            if($(this).attr('data-toggled') == 'true'){
                $(this).text($(this).attr('data-file-path'));
                $(this).attr('data-toggled', false)
            }else{
                $(this).text($(this).attr('data-file-name'));
                $(this).attr('data-toggled', true)
            }
        })

    })
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
        appendProgressBartHtml()
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
                    appendResultContainerHtml(response.length - 1);
                    appendResultHtml(response);

                    let upperCounter = parseInt((response.length/100) * 5)
                    if(upperCounter === 0){
                        upperCounter = 1;
                    }
                    handleFilesNames();
                    for(let i = 0; i < response.length -1; i = i + upperCounter){
                        console.log(i)
                        setTimeout(() => {
                            $('.progress-bar').css('left', 0 + "%" )
                        }, 100)

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
                                let response2 = res;
                                response2 = response2.split('/');
                                response2.filter(element => element != null && element.length > 0)
                            }
                        })
                    }
                    $('.form-ajax__action').attr('name', 'ajax_find_files');
                    $('.form-ajax__action').val(1)
                    handleButtonLoader(convertButton) // убираем лоадер с кнопки
                }
            }
        });
    })



});