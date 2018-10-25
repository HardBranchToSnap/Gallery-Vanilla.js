// module edit pic after loading
(function() {
    var Form = {
        CLOSE_EDIT_BUTTON: document.querySelector('.upload-form-cancel'),
        SUBMIT_BUTTON: document.querySelector('#upload-submit'),
        LOADER_BUTTON: document.querySelector('#loader-submit'),
        UPLOAD_INPUT: document.querySelector('#upload-file'),
        HASHTAG_INPUT: document.querySelector('.upload-form-hashtags'),
        PREVIEW_PICTURE: document.querySelector('.effect-image-preview'),
        FILTERS_BLOCK: document.querySelector('.upload-effect-controls'),
        FILTER_NONE_RADIO: document.querySelector('#upload-effect-none'),
        HASHTAGS_BAR: document.querySelector('.hashtags-bar'),
        SLIDER: document.querySelector('.upload-effect-level'),
        EFFECT_PIN: document.querySelector('.upload-effect-level-pin'),
        SEND_FORM: document.querySelector('#upload-select-image')
    };

    var Slider = {
      DEFAULT_COORDS: 80,
      UPLOAD_EFFECT_LINE: document.querySelector('.upload-effect-level-line'),
      UPLOAD_EFFECT_PROGRESS: document.querySelector('.upload-effect-level-val')
    };

    var startX, appliedFilter = null;

    var MAX_HASHTAGS = 5;
    var hashtags = [];

    var showEditPopup = function() {
        window.Support.togglePopup('.upload-overlay');
        window.toggleSortFiltersZindex();

        Form.SLIDER.classList.add('hidden');

        appliedFilter = 'none';
        Form.FILTER_NONE_RADIO.checked = true;

        setDefaultCoords();
        customizeFilter(Slider.DEFAULT_COORDS);

        var onEditPopupEscapePress = document.addEventListener('keydown', hideEditPopupEsc);

        var onCloseEditPopupButtonClick = Form.CLOSE_EDIT_BUTTON.addEventListener('click', hideEditPopup);

        var onFilterInputChange = Form.FILTERS_BLOCK.addEventListener('change', applyFilter);


        onHashtagInputChange();
        onDescriptionTextareaChange();
    };

    var hideEditPopup = function() {
        Form.UPLOAD_INPUT.value = '';
        window.toggleSortFiltersZindex();
        window.Support.togglePopup('.upload-overlay');
        document.removeEventListener('keydown', hideEditPopupEsc);
    };

    var hideEditPopupEsc = function(evt) {
        if (evt.keyCode == window.KeyCode.ESC) {
            hideEditPopup();
        }
    };

    var setDefaultCoords = function() {
        Form.EFFECT_PIN.style.left = Slider.DEFAULT_COORDS + '%';
        Slider.UPLOAD_EFFECT_PROGRESS.style.width = Slider.DEFAULT_COORDS + '%';
    };

    var applyFilter = function(evt) {
        var effectId = evt.target.id;
        appliedFilter = effectId.split('-').pop();

        var toggleSlider = appliedFilter == 'none' ? Form.SLIDER.classList.add('hidden') : Form.SLIDER.classList.remove('hidden');

        //Устанавливаем превью-эффект
        setDefaultCoords();
        customizeFilter(Slider.DEFAULT_COORDS);
    };

    var filterToEffect = {
        'chrome': ['grayscale', 100],
        'sepia': ['sepia', 100],
        'marvin': ['invert', 100],
        'phobos': ['blur', 10, 'px'],
        'heat': ['brightness', 10],
        'none': ['grayscale', false]
    };

    var customizeFilter = function(pinCoordsPercent) {
        var thisFilter = filterToEffect[appliedFilter];
        var filterEffect = thisFilter[0];
        var filterStep = thisFilter[1];
        var filterUnit = thisFilter.length == 3 ? thisFilter[2] : '';
        var filterFormula = thisFilter[1] ? (pinCoordsPercent / filterStep) : 0;
        Form.PREVIEW_PICTURE.style.filter = filterEffect + '(' + filterFormula + filterUnit + ')';
    };

    var onFilterMouseMove = function(moveEvt) {
        moveEvt.preventDefault();
        var shiftX = startX - moveEvt.clientX;
        startX = moveEvt.clientX;

        window.toggleSlider(shiftX, Form.EFFECT_PIN, Slider.UPLOAD_EFFECT_LINE, Slider.UPLOAD_EFFECT_PROGRESS, customizeFilter);
    };

    var onFilterMouseUp = function(upEvt) {
        upEvt.preventDefault();
        document.removeEventListener('mousemove', onFilterMouseMove);
        document.removeEventListener('mouseup', onFilterMouseUp);
    };



    var onHashtagInputChange = function() {
        Form.HASHTAG_INPUT.addEventListener('keydown', onHashtagInputSpacePress);
        Form.HASHTAG_INPUT.addEventListener('keydown', onInputFieldEscapePress);
    };

    var onDescriptionTextareaChange = function() {
        var descriptionTextarea = document.querySelector('.upload-form-description');
        descriptionTextarea.addEventListener('keydown', onInputFieldEscapePress);
    };

    var onInputFieldEscapePress = function(evt) {
        if (evt.keyCode == window.KeyCode.ESC) {
            evt.target.blur();
            evt.stopPropagation();
        }
    };

    var onHashtagInputSpacePress = function(evt) {
        if (evt.keyCode == window.KeyCode.SPACE) {
            if (evt.currentTarget.validity.valid) {
                evt.preventDefault();
                addHashtag(event.currentTarget.value);
            } else {
                evt.preventDefault();
                setErrorHashtag(evt.currentTarget);
            }
        }
    };

    var setErrorHashtag = function(inputField) {
        if (inputField.validity.tooShort) {
            alert('Is to short!');
        } else if (inputField.validity.tooLong) {
            alert('Is to long!');
        } else if (inputField.validity.valueMissing) {
            alert('Cant be empty!');
        } else if (inputField.validity.patternMismatch) {
            alert('Pattern mismatch');
        }
    };

    var addHashtag = function(hashtag) {
        var lowCaseHashtags = hashtags.map(function(elem) {
            return elem.toLowerCase();
        });

        if (lowCaseHashtags.includes(hashtag.toLowerCase())) {
            alert('У вас уже есть такой хештег');
        } else if (hashtags.length < MAX_HASHTAGS) {
            hashtags.push(hashtag);

            var hashtagEl = document.createElement('span');
            hashtagEl.classList.add('upload-form-hashtag');
            hashtagEl.textContent = hashtag;
            Form.HASHTAGS_BAR.appendChild(hashtagEl);

            Form.HASHTAG_INPUT.value = '';
        } else {
            alert('Можно добавить только' +  MAX_HASHTAGS + 'хештегов');
        }
        console.log(hashtags);
    };

    var removeHashtag = function(evt){
        if (evt.target.tagName == 'SPAN') {
          var thisHashtag = evt.target;

          thisHashtag.parentNode.removeChild(thisHashtag);
          hashtags.splice( hashtags.findIndex(function(el){
            return el == thisHashtag.textContent;
          }), 1 );
        }
    };

    var onHashtagRemoveSpanClick = Form.HASHTAGS_BAR.addEventListener('click', removeHashtag);

    var onEffectPinMouseDown = Form.EFFECT_PIN.addEventListener('mousedown', function(evt) {
        evt.preventDefault();

        document.addEventListener('mousemove', onFilterMouseMove);
        document.addEventListener('mouseup', onFilterMouseUp);
    });

    Form.SEND_FORM.addEventListener('submit', function(evt) {
        window.upload(new FormData(Form.SEND_FORM)).then(function(response) {
            console.log(response);
            hideEditPopup();
            Form.SUBMIT_BUTTON.classList.toggle('hidden');
            Form.LOADER_BUTTON.classList.toggle('hidden');
        }).catch(function(error) {
            console.log(error);
        });

        evt.preventDefault();
    });

    Form.SUBMIT_BUTTON.addEventListener('click', function(evt) {
        Form.SUBMIT_BUTTON.classList.toggle('hidden');
        Form.LOADER_BUTTON.classList.toggle('hidden');
    });
    var onUpFileChange = Form.UPLOAD_INPUT.addEventListener('change', showEditPopup);
    // end module
}());