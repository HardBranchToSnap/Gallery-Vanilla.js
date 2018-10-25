(function() {
    var GalleryElement = {
        DEFAULT_AVATAR: 'img/avatar-1.jpg',
        FILTERS: document.querySelector('.filters'),
        PICTURES_CONTAINER: document.querySelector('#miniatures'),
        POPULAR_FILTER: document.querySelector('#filter-popular'),
        RECOMMENDED_FILTER: document.querySelector('#filter-recommend'),
        SHOWMORE_COMMENTS_BUTTON: document.querySelector('.comments_showmore'),
        COMMENT: document.querySelector('.social__comment')
    };

    var SortFilters = {
        'recommend': function() {
            DATA.forEach(renderPhotos);
        },
        'popular': function() {
            DATA.slice().sort(function(left, right) {
                return right.likes - left.likes;
            }).forEach(renderPhotos);
        },
        'discussed': function() {
            DATA.slice().sort(function(left, right) {
                return right.comments.length - left.comments.length;
            }).forEach(renderPhotos);
        },
        'random': function() {
            window.Support.shuffle(DATA.slice()).forEach(renderPhotos);
        },
        'liked': function(){
            likedData.reverse().forEach(function(el){
              renderPhotos(DATA[el]);
            });
        }
    };

    var TemplateElement = {
        picture: document.querySelector('#picture-template')
            .content.querySelector('.miniature')
    };

    var lastDebounceTimeout;
    var DEBOUNCE_TIME = 700;
    var COMMENTS_SLICE = 5;

    var DATA;
    var likedData = [];

    window.loaddata().then(function(data) {
        DATA = data;
        console.log(DATA);
        DATA.forEach(renderPhotos);
        GalleryElement.FILTERS.classList.remove('hidden');
    }).catch(function(error) {
        console.log(error);
    });

    window.toggleSortFiltersZindex = function(){
      GalleryElement.FILTERS.style.zIndex = GalleryElement.FILTERS.style.zIndex == "0" ? "3" : "0";
    };

    var renderPhotos = function(item) {
        var clonedPictureEl = TemplateElement.picture.cloneNode(true);

        clonedPictureEl.querySelector('#miniature-pic').src = item.url;
        clonedPictureEl.querySelector('#miniature-pic').id = DATA.indexOf(item);
        if(likedData.includes(DATA.indexOf(item)) ){
          clonedPictureEl.querySelector('.miniature-like').classList.toggle('dolike');
          clonedPictureEl.querySelector('.liked-nohover').classList.toggle('hidden');
        }

        GalleryElement.PICTURES_CONTAINER.appendChild(clonedPictureEl);
    };

    var renderComment = function(commentText) {
        var clonedCommentEl = GalleryElement.COMMENT.cloneNode(true);

        var thisCommentAvatar = clonedCommentEl.querySelector('.social__picture');
        var thisCommentContent = clonedCommentEl.querySelector('.social__text');

        thisCommentAvatar.src = GalleryElement.DEFAULT_AVATAR;
        thisCommentContent.textContent = commentText;

        return clonedCommentEl;
    };

    var fillPopup = function(id) {
        var thisPhoto = DATA[id];
        var thisComments = document.querySelector('.social__comments');
        var popupElement = document.querySelector('.gallery-overlay');

        // Пулл шапки фото
        popupElement.querySelector('.gallery-overlay-image').src = thisPhoto.url;
        popupElement.querySelector('.likes-count').textContent = thisPhoto.likes;
        popupElement.querySelector('.comments-count').textContent = thisPhoto.comments.length;

        // Удаляем все комментарии, если таковы имеются
        window.Support.removeAllChilds(thisComments);

        // Showmore блок
        if (thisPhoto.comments.length > COMMENTS_SLICE) {
            GalleryElement.SHOWMORE_COMMENTS_BUTTON.classList.remove('hidden');
        } else {
            GalleryElement.SHOWMORE_COMMENTS_BUTTON.classList.add('hidden');
        }
        // Пулл комментариев
        var minCommentIndex = thisPhoto.comments.length > COMMENTS_SLICE ? thisPhoto.comments.length - COMMENTS_SLICE : 0;
        thisPhoto.comments.slice(minCommentIndex, thisPhoto.comments.length).forEach(function(comment) {
            var clonedCommentEl = renderComment(comment);

            thisComments.appendChild(clonedCommentEl);
        });
    };


    var showPopup = function() {
        window.Support.togglePopup('.gallery-overlay');
        document.addEventListener('keydown', onPopupEscapePress);
        document.addEventListener('keydown', onPopupArrowRightPrees);
        document.addEventListener('keydown', onPopupArrowLeftPrees);
    };

    var hidePopup = function() {
        window.Support.togglePopup('.gallery-overlay');
        document.removeEventListener('keydown', onPopupEscapePress);
        document.removeEventListener('keydown', onPopupArrowRightPrees);
        document.removeEventListener('keydown', onPopupArrowLeftPrees);
    };

    var onPopupEscapePress = function(evt) {
        if (evt.keyCode == window.KeyCode.ESC) {
            hidePopup();
        }
    };

    var onPopupArrowRightPrees = function(evt) {
        var nextPicId;
        if (evt.keyCode == window.KeyCode.ARROW_RIGHT && window.lastOpenedPicId != (DATA.length - 1)) {
            nextPicId = window.lastOpenedPicId + 1;
            fillPopup(nextPicId);
            window.lastOpenedPicId += 1;
            console.log(window.lastOpenedPicId);
        } else if (window.lastOpenedPicId == (DATA.length - 1) ) {
            hidePopup();
        }
    };

    var onPopupArrowLeftPrees = function(evt) {
        var prevPicId;
        if (evt.keyCode == window.KeyCode.ARROW_LEFT && window.lastOpenedPicId != 0) {
            prevPicId = window.lastOpenedPicId - 1;
            fillPopup(prevPicId);
            window.lastOpenedPicId -= 1;
            console.log(window.lastOpenedPicId);
        } else if (window.lastOpenedPicId == 0) {
            hidePopup();
        }
    };

    var showPhoto = function(id) {
        window.lastOpenedPicId = parseInt(id);
        console.log(window.lastOpenedPicId);
        fillPopup(id);
        console.log(id);
        showPopup();
    };

    var debounceEffect = function() {
        var miniaturePictures = document.querySelectorAll('.miniature');
        miniaturePictures.forEach(function(elem) {
            // заблурить картинку
            var thisPicture = elem.querySelector('.miniature-pic');
            thisPicture.style.filter = 'blur(10px)';
            // добавить спинер на картинку
            elem.querySelector('.cssload-bell').classList.remove('hidden');
        });
    };

    var debounceProtection = function(callback) {
        if (lastDebounceTimeout) {
            window.clearTimeout(lastDebounceTimeout);
        }
        lastDebounceTimeout = window.setTimeout(function() {
            callback();
        }, DEBOUNCE_TIME);
    };

    var onSortFilterChange = GalleryElement.FILTERS.addEventListener('change', function(evt) {
        debounceEffect();
        var thisSortFilter = evt.target.id.split('-').pop();

        debounceProtection(function() {
            window.Support.removeAllChilds(GalleryElement.PICTURES_CONTAINER);
            SortFilters[thisSortFilter]();
        });
    });

    var setLike = function(likeButton){
      likeButton.classList.toggle('dolike');
      console.log(likeButton.parentNode);
      likeButton.parentNode.querySelector('.liked-nohover').classList.toggle('hidden');

      var likedMiniature = likeButton.parentNode.querySelector('.miniature-pic');
      var likedId = parseInt(likedMiniature.id);
      if(!likedData.includes(likedId)){
        likedData.push(likedId);
        DATA[likedId].likes = DATA[likedId].likes + 1;
      }
      else{
        likedData.splice(likedData.findIndex(function(el){return el == likedId;}), 1);
        DATA[likedId].likes = DATA[likedId].likes - 1;
      }
      console.log(likedData);
    };

    var onPictureMiniatureClick = GalleryElement.PICTURES_CONTAINER.addEventListener('click', function(evt) {
        if (evt.target.parentNode.className == 'miniature' && evt.target.tagName != 'BUTTON') {
            showPhoto(evt.target.id);
        }
    });

    var onMiniatureLikeClick = GalleryElement.PICTURES_CONTAINER.addEventListener('click', function(evt){
      if (evt.target.parentNode.className == 'miniature' && evt.target.tagName == 'BUTTON'){
        setLike(evt.target);
      }
    });

    var onShowmoreCommentsClick = GalleryElement.SHOWMORE_COMMENTS_BUTTON.addEventListener('click', function() {
        var commentsBlock = document.querySelector('.social__comments');

        var commentsLength = DATA[lastOpenedPicId].comments.length;
        var otherComments = DATA[lastOpenedPicId].comments.slice(0, commentsLength - COMMENTS_SLICE);

        otherComments.reverse().forEach(function(comment) {
            var clonedCommentEl = renderComment(comment);

            commentsBlock.insertBefore(clonedCommentEl, commentsBlock.firstChild);
        });

        // Убрать кнопку
        GalleryElement.SHOWMORE_COMMENTS_BUTTON.classList.add('hidden');
    });

    var onNonPopupClick = document.addEventListener('click', function(evt) {
        var popupElement = document.querySelector('.gallery-overlay');
        if (evt.target == popupElement) {
            window.Support.togglePopup('.gallery-overlay');
        }
    });
    // end module
}());