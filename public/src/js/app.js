"use strict";

var _services_slick_slide;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var startUploader = function startUploader(input) {
  $(input).click();
};

var app = {
  config: {
    services_slick_slider: (_services_slick_slide = {
      centerMode: true,
      centerPadding: "200px",
      slidesToShow: 3,
      arrows: true,
      dots: false
    }, _defineProperty(_services_slick_slide, "centerMode", true), _defineProperty(_services_slick_slide, "prevArrow", $(".prev-arrow")), _defineProperty(_services_slick_slide, "nextArrow", $(".next-arrow")), _defineProperty(_services_slick_slide, "responsive", [{
      breakpoint: 1600,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "130px",
        slidesToShow: 2
      }
    }, {
      breakpoint: 1300,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "130px",
        slidesToShow: 1
      }
    }, {
      breakpoint: 900,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "100px",
        slidesToShow: 1
      }
    }, {
      breakpoint: 800,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: "0",
        slidesToShow: 1
      }
    }]), _services_slick_slide)
  },
  navigationSpyScroll: function navigationSpyScroll() {
    var nav = $("#navbar");
    var navHeight = nav.outerHeight();
    nav.find("[navbar-toggler]").click(function () {
      $(".pl_navbar_nav").toggleClass("active");
    });
    $('a[href*="#"]:not([href="#"])').click(function (event) {
      scrollToSection(this);

      if ($(document).width() <= 1100) {
        $(".pl_navbar_nav").removeClass("active");
      }

      event.preventDefault();
    });
    $(document).scroll(function () {
      activateCurrentSection();
    });

    function scrollToSection(self) {
      var href = $(self).attr("href");
      var targetPos = $(href).offset().top - navHeight + 50;
      $("html, body").animate({
        scrollTop: targetPos
      }, 1000);
    }

    $(document).on("scroll ready", function () {
      activateCurrentSection();
      makeStickyNavigation();
    });

    function makeStickyNavigation() {
      if ($(window).scrollTop() > 100) {
        $("#navbar").addClass("sticky");
        $("#scrolltop").css("opacity", "1");
      } else {
        $("#navbar").removeClass("sticky");
        $("#scrolltop").css("opacity", "0");
      }
    }

    function activateCurrentSection() {
      var id;
      var sections = $(".pl_section, .pl_header");
      var pos = $(document).scrollTop();
      var lastSection = sections[sections.length - 1]; // get last section

      var lastSectionTooSmall = $(lastSection).height() < $(window).height();

      if (lastSectionTooSmall) {
        var lastSectionTopPos = $(lastSection).offset().top;
        var lastSectionTriggerPos = $(window).height() + $(document).scrollTop() - $(lastSection).height() / 4;
        var lastSectionInView = lastSectionTriggerPos > lastSectionTopPos;
      }

      if (lastSectionTooSmall && lastSectionInView) {
        id = $(lastSection).attr("id");
      } else {
        sections.each(function () {
          var top = $(this).offset().top - navHeight;
          var bottom = top + $(this).outerHeight();

          if (pos >= top && pos <= bottom) {
            id = $(this).attr("id");
          }
        });
      }

      if (id) {
        nav.find("a").parent().removeClass("active");
        nav.find('a[href="#' + id + '"]').parent().addClass("active");
      }
    }
  },
  accordion: function accordion() {
    $(document).on("click", "[data-accordion-toggler]", function () {
      var toggler = $(this);
      var accordion = $(toggler.data("accordion"));
      var accordion_group = accordion.parent(".pl_accordion");
      var accordions = accordion_group.find(".pl_accordion_item");
      accordions.removeAttr("data-visible");
      accordions.find("[data-accordion-toggler]").removeClass("pl_button_collapse-close");
      accordions.find("[data-accordion-toggler]").addClass("pl_button_collapse-open");
      console.log(accordion[0].hasAttribute("data-visible"));

      if (accordion[0].hasAttribute("data-visible")) {
        accordion.removeAttr("data-visible");
        toggler.removeClass("pl_button_collapse-close");
        toggler.addClass("pl_button_collapse-open");
      } else {
        accordion.attr("data-visible", "visible");
        toggler.removeClass("pl_button_collapse-open");
        toggler.addClass("pl_button_collapse-close");
      }
    });
  },
  events: function events() {
    var slick_options = this.config.services_slick_slider; // Start spy scroll

    this.navigationSpyScroll(); // Start accordion component

    this.accordion(); // Generate services slick slider

    $("#pl_services").slick(slick_options); // Remove drag ability for images

    $("img").attr("draggable", false); // Register read more elements

    var readmore = new Readmore(document.querySelectorAll(".pl_readmore"), {
      speed: 500,
      collapsedHeight: "71px",
      defaultHeight: "71px",
      moreLink: "<a href=\"#\" class=\"pl_button pl_button_link\">Read more <i class=\"fas fa-chevron-down\"></i></a>",
      lessLink: "<a href=\"#\" class=\"pl_button pl_button_link\">Close <i class=\"fas fa-chevron-up\"></i></a>"
    }); // readmore.toggle();

    if ($(document).width() <= 450) {
      console.log(document.getElementById("pl_readmore_languages"));
      var readmore_languages = new Readmore(document.getElementById("pl_readmore_languages"), {
        speed: 1000,
        collapsedHeight: "250px",
        defaultHeight: "250px",
        moreLink: "<a href=\"#\" class=\"pl_button pl_button_link\">Read more <i class=\"fas fa-chevron-down\"></i></a>",
        lessLink: "<a href=\"#\" class=\"pl_button pl_button_link\">Close <i class=\"fas fa-chevron-up\"></i></a>"
      });
    }
  },
  init: function init() {
    this.events();
  }
};
app.init();