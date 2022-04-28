$(document).ready(function() {
  updateCommentCount();
  updateLikeCount();
  $(".horizontal_cards").scrollLeft(0);
  // checkProfileCardsOverflow();

  // $("body").on("mousedown ", function(evt) {
  //   let tapElem = $(`<div class="tap_highlight"></div>`);
  //   tapElem.css({
  //     top: evt.clientY - 30,
  //     left: evt.clientX - 30
  //   });
  //   $("body").append(tapElem);
  //   setTimeout(() => {
  //     tapElem.remove();
  //   }, 500);
  // });

  $("body").on("click", ".action-like", function(evt) {
    evt.stopPropagation();

    if(!$(this).hasClass("liked")) {
      $(this).addClass("liked");
      $(this).find(".action-icon-img").attr("src", "img/icon/like-blue.png").addClass("like_animation");

      let targetElement = $(this).find(".like_count");

      if($(this).closest("[data-target]") && $(this).closest("[data-target]").length > 0) {
        let targetCard = $(`.${$(this).closest("[data-target]").attr("data-target")}`);
        targetElement = targetCard.find(".like_count");

        // Update like color inside the overlay card
        targetElement.closest(".action-like").addClass("liked");
        targetElement.closest(".action-like").find(".action-icon-img").attr("src", "img/icon/like-blue.png").addClass("like_animation");
      }

      // Update like color on main feed
      if($(this).closest(".overlay_card") && $(this).closest(".overlay_card").length > 0) {
        let targetElement = $(`.main_feed [data-target="overlay_card1"]`);
        if($(this).closest(".overlay_card").hasClass("overlay_card2")) {
          targetElement = $(`.main_feed [data-target="overlay_card2"]`);
        }
        targetElement.find(".action-like").addClass("liked");
        targetElement.find(".action-like").find(".action-icon-img").attr("src", "img/icon/like-blue.png").addClass("like_animation");
      }
      // end update like color

      if(targetElement.length > 0) {
        let targetElementCount = parseInt(targetElement.text());

        // let lastChar = targetElement.text().split('')[targetElement.text().split('').length - 1];
        // if(lastChar === 'k' || lastChar === 'K') {
        //   console.log(targetElementCount);
        // }

        targetElement.text(targetElementCount + 1);
        updateLikeCount();
      }
    }
  });

  let lastScrollTopPos = 0;
  $("body").on("click", ".action-comment", function(evt) {
    if($(this).closest(".feed_page").hasClass("overlay_card")) {
      $("html").scrollTop($("html")[0].scrollHeight);
      $(this).closest(".feed_page").find(".comment_input").focus();
    }
  });
  $("body").on("click", "[data-target]", function(evt) {
    if($(this).attr("data-target").length > 0) {
      let targetOverlayCard = $(this).attr("data-target");
      lastScrollTopPos = $("html").scrollTop();
      $(".main_feed").addClass("hide");
      $(`.${targetOverlayCard}`).addClass("show")
      $("html").scrollTop(0);
    }
  });
  $("body").on("click", ".overlay_card .go_back", function(evt) {
    // $("html").removeClass("no_overflow");
    $(".overlay_card").addClass("hide_right");
    setTimeout(() => {
      $(".main_feed").removeClass("hide");
      $(".overlay_card").removeClass("show hide_right");
      $("html").scrollTop(lastScrollTopPos);
    }, 300);
  });

  $("body").on("click", ".go_home", function(evt) {
    // $("html").removeClass("no_overflow");
    $(".overlay_card").addClass("hide_right");
    setTimeout(() => {
      $(".main_feed").removeClass("hide");
      $(".overlay_card").removeClass("show hide_right");
      // $("html").scrollTop(0);
      $("html").animate({scrollTop: 0}, 350);
    }, 300);
  });

  $("body").on("click", ".hashtag", function(evt) {
    $(this).toggleClass("selected");
  });

  $("body").on("click", ".button-follow-user", function(evt) {
    $(this).addClass("rd-button-ghost rd-button-icon-text is_following").removeClass("rd-button-primary");
    // $(this).toggleClass("rd-button-ghost rd-button-icon-text is_following rd-button-primary");
    $(this).find(".rd-button-text").text("Following");
  });

  $("body").on("click", ".horizontal_scroll_container .button-left", function(evt) {
    let targetElement = $(this).closest(".horizontal_scroll_container").find(".horizontal_cards");
    let currentScrollPos = targetElement.scrollLeft();
    targetElement.animate({scrollLeft: currentScrollPos - 139}, 350);
  });
  $("body").on("click", ".horizontal_scroll_container .button-right", function(evt) {
    let targetElement = $(this).closest(".horizontal_scroll_container").find(".horizontal_cards");
    let currentScrollPos = targetElement.scrollLeft();
    targetElement.animate({scrollLeft: currentScrollPos + 139}, 350);
  });

  // $(".horizontal_cards").on("scroll", function(evt) {
  //   checkProfileCardsOverflow();
  //   // $("head [name='theme-color']").attr("content", "#F00");
  //   // $("head").append(`<meta name="theme-color" content="#FFF">`);
  // });

  $("body").on("keydown", ".comment_input", function(evt) {
    if(evt.keyCode === 13 || evt.which === 13) {
      let targetParent = $(this).closest(".content").find(".comments_container");
      if(targetParent.length <= 0) {
        $(this).closest(".content").find(".add_comment_section").before(`<div class="comments_container"></div>`);
        targetParent = $(this).closest(".content").find(".comments_container");
      }

      let commentText = $(this).val();

      if(commentText.trim().length > 0) {
        commentText = parseComment(commentText);

        targetParent.append(`
          <div class="comment">
            <div class="user_profile">
              <div class="user_pic">
                <img src="img/profile_pics/Sean.jpg" />
              </div>
              <div class="">
                <div class="user_name">
                  Sean Zinsmeister
                </div>
                <div class="user_activity">
                  now
                </div>
              </div>
            </div>
            <div class="comment_text">
              ${commentText}
            </div>
          </div>
        `);
        $(this).val(""); // clear text
        $(this).blur();

        $("html").scrollTop($("html")[0].scrollHeight);
        updateCommentCount();
      }
    }
  });

  let isFilteringUsersList = false;
  let targetInputContainer = null;
  $("body").on("input", ".comment_input", function(evt) {
    // console.log($(this).val().substr($(this).val().length - 1));
    if($(this).val().substr($(this).val().length - 1) === "@" || isFilteringUsersList) {
      targetInputContainer = $(this);
      isFilteringUsersList = true;
      $(".users_list").css({
        "bottom": $(document).height() - $(this).offset().top,
        "left": $(this).offset().left,
      });
      $(".users_list .users_list_item").removeClass("hide");
      // $(".users_list").addClass("show");

      let lastIndexOfAt = $(this).val().lastIndexOf("@");
      filterUsersList($(this).val().substring(lastIndexOfAt + 1));
    }

    if($(this).val().substr($(this).val().length - 1) === " ") {
      targetInputContainer = null;
      isFilteringUsersList = false;
      $(".users_list").removeClass("show");
    }
  });

  $("body").on("focus", ".comment_input", function(evt) {
    $(this).closest(".content").addClass("input_focused");
    $(".footer_nav").addClass("hide");

    let commentsContainer = $(this).closest(".content").find(".comments_container");

    if(commentsContainer.length <= 0) {
      $("html").animate({scrollTop: 150}, 250);
    }
    if(commentsContainer.find(".comment").length === 1) {
      $("html").animate({scrollTop: 260}, 250);
    }
    if(commentsContainer.find(".comment").length === 2) {
      $("html").animate({scrollTop: 350}, 250);
    }
  });
  $("body").on("blur", ".comment_input", function(evt) {
    $(".content").removeClass("input_focused");
    $(".footer_nav").removeClass("hide");
  });

  $("body").on("click", ".users_list_item", function(evt) {
    // console.log($(this).val().substr($(this).val().length - 1));
    if(targetInputContainer) {
      let lastIndexOfAt = targetInputContainer.val().lastIndexOf("@");
      targetInputContainer.val(targetInputContainer.val().substring(0, lastIndexOfAt + 1) + $(this).text().trim());
    }
    targetInputContainer.focus();
    $(".users_list").removeClass("show");
  });

  // $("body").on("click", ".comments_container .link", function(evt) {
  //   $(this).prevAll(".comment").removeClass("hide");
  //   $(this).addClass("hide");
  // });


  // $(document).on("scroll", function(evt) {
  //   // console.log($(".overlay_card.show .card_title").offset().top - $("html").scrollTop());
  //   if($(".overlay_card.show").length > 0) {
  //     if($(".overlay_card.show .card_title").offset().top - $("html").scrollTop() < 30) {
  //       $(".overlay_card.show").find(".page_title_container").addClass("show");
  //     } else if($(".overlay_card.show .card_title").offset().top - $("html").scrollTop() > 74) {
  //       $(".overlay_card.show").find(".page_title_container").removeClass("show");
  //     }
  //   }
  // });
});

function filterUsersList(filterString) {
  $(".users_list .users_list_item").each(function() {
    // console.log(!$(this).text().trim().indexOf(filterString) === 0 && $(this).text());
    let splitNames = $(this).text().trim().toLowerCase().split(".");
    // console.log(splitNames);
    if(splitNames[0].indexOf(filterString.toLowerCase()) !== 0 &&
       splitNames[1].indexOf(filterString.toLowerCase()) !== 0) {
      $(this).addClass("hide");
    }
  });

  if($(".users_list .users_list_item").length === $(".users_list .users_list_item.hide").length) {
    $(".users_list").removeClass("show");
  }
}

function parseComment(comment) {
  comment = comment.replace(/(\#[a-zA-Z0-9\-\_]+)/g,"<span class='link'>$1</span>");
  // comment = comment.replace(/(\@[a-zA-Z0-9\-\_\.]+)/g,"<span class='at_mention'>$1</span>");
  comment = comment.replace(/(\@[a-zA-Z0-9\-\_\.]+)/g,"<span class='link'>$1</span>");

  return comment;
}

function checkProfileCardsOverflow() {
  $(".horizontal_cards").each(function() {
    if($(this)[0].scrollWidth > $(this).width()) {
      if($(this).scrollLeft() < $(this)[0].scrollWidth - $(this).width()) {
        $(this).closest(".horizontal_scroll_container").addClass("show_right");
      } else {
        $(this).closest(".horizontal_scroll_container").removeClass("show_right");
      }

      if($(this).scrollLeft() > 0) {
        $(this).closest(".horizontal_scroll_container").addClass("show_left");
      } else {
        $(this).closest(".horizontal_scroll_container").removeClass("show_left");
      }
    }
  });
}

function showUpdateFeedCTA() {
  $(".button-update-feed").addClass("show");
}

function hideUpdateFeedCTA() {
  $(".button-update-feed").removeClass("show");
}

function updateCommentCount() {
  $("[data-target]").each(function() {
    let targetCard = $(`.${$(this).attr("data-target")}`);
    let totalCommentCount = targetCard.find(".comments_container .comment").length;
    $(this).find(".comment_count").text(totalCommentCount);
    targetCard.find(".comment_count").text(totalCommentCount);
  });
}

function updateLikeCount() {
  $(".card").each(function() {
    if($(this).closest("[data-target]") && $(this).closest("[data-target]").length > 0) {
      let targetCard = $(`.${$(this).attr("data-target")}`);
      let totalLikeCount = targetCard.find(".like_count").text();
      $(this).find(".like_count").text(totalLikeCount);
    }
  });
}
