var app = {
    config: {
        services_slick_slider: {
            centerMode: true,
            centerPadding: "200px",
            slidesToShow: 3,
            arrows: true,
            dots: false,
            prevArrow: $(".prev-arrow"),
            nextArrow: $(".next-arrow"),
            responsive: [{
                breakpoint: 1600,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "130px",
                    slidesToShow: 2,
                },
            }, {
                breakpoint: 1300,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "130px",
                    slidesToShow: 1,
                },
            }, {
                breakpoint: 900,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "100px",
                    slidesToShow: 1,
                },
            }, {
                breakpoint: 800,
                settings: {
                    arrows: false,
                    centerMode: true,
                    centerPadding: "0",
                    slidesToShow: 1,
                },
            },],
        }
    },

    get_free_quote: function () {
        $(window).on("load", function () {
            var input = $("#phone_number[type=\"tel\"]").intlTelInput({
                initialCountry: "auto",
                geoIpLookup: function (success) {
                    $.get("https://ipapi.co/json/").then(function (response) {
                        var countryCode = (response && response.country) ? response.country : "us";
                        success(countryCode);
                    });
                },
                customPlaceholder: function (selectedCountryPlaceholder) {
                    return "e.g. " + selectedCountryPlaceholder;
                },
            });

            input.on("keyup", function () {
                $("[name=\"phone_number\"]").val($(this).intlTelInput("getNumber"));
            });

            FilePond.registerPlugin(
                FilePondPluginFileEncode,
                FilePondPluginFileValidateSize,
                FilePondPluginFileValidateType,
                FilePondPluginImagePreview
            );


            $(".pl_form_control.file-pond[type=\"file\"]").filepond({
                allowFileEncode: true,
                maxTotalFileSize: 40000000,
                acceptedFileTypes: [
                    "image/*",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "application/vnd.ms-powerpoint",
                    "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                    "text/plain",
                    "application/pdf",
                    "video/mp4",
                    "video/x-m4v",
                    "video/*",
                    "zip",
                    "application/octet-stream",
                    "application/zip",
                    "application/x-zip",
                    "application/x-zip-compressed",
                    ".ai",
                    ".psd",
                    ".xd",
                ]
            });

            $("select").select2();

            jQuery.validator.addMethod("intlTelNumber", function (value, element) {
                return this.optional(element) || $(element).intlTelInput("isValidNumber");
            }, "Please enter a valid International Phone Number");

            $("#get_free_quote_form").validate({
                errorElement: "small",
                errorClass: "pl_form_control-error",

                rules: {
                    "full_name": {
                        required: true,
                    },
                    "email": {
                        required: true,
                        email: true,
                    },
                    "company_name": {
                        required: true,
                    },
                    "phone_number": {
                        required: true,
                        intlTelNumber: true,
                    },
                    "source_language": {
                        required: true,
                    },
                    "target_language": {
                        required: true,
                    },
                    "notes": {
                        required: true,

                    },
                }
            });

            $(document).on("submit", "#get_free_quote_form", function (event) {

                console.log($(this).valid());
                if ($(this).valid()) {
                    $("#loading").show();
                } else {
                    event.preventDefault();
                }
            });
        });
    },

    navigationSpyScroll: function () {
        var nav = $("#navbar");
        var navHeight = nav.outerHeight();

        nav.find(".navbar-toggler").click(function () {
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
                    scrollTop: targetPos,
                },
                1000
            );
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
            var lastSectionInView;

            if (lastSectionTooSmall) {
                var lastSectionTopPos = $(lastSection).offset().top;
                var lastSectionTriggerPos =
                    $(window).height() +
                    $(document).scrollTop() -
                    $(lastSection).height() / 4;
                lastSectionInView = lastSectionTriggerPos > lastSectionTopPos;
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
                nav.find("a")
                    .parent()
                    .removeClass("active");
                nav.find('a[href="#' + id + '"]')
                    .parent()
                    .addClass("active");
            }
        }
    },

    accordion: function () {
        $(document).on("click", ".accordion-toggler", function () {

            var toggler = $(this);
            var accordion = $(toggler.data("accordion"));
            var accordion_group = accordion.parent(".pl_accordion");

            var accordions = accordion_group.find(".pl_accordion_item");
            accordions.attr("data-visible", false);
            accordions.find(".accordion-toggler").removeClass("pl_button_collapse-close");
            accordions.find(".accordion-toggler").addClass("pl_button_collapse-open");


            if (accordion.data("visible") === true) {
                accordion.attr("data-visible", false);
                toggler.removeClass("pl_button_collapse-close");
                toggler.addClass("pl_button_collapse-open");
            } else {
                console.log(accordion.data("visible"));
                accordion.attr("data-visible", true);
                toggler.removeClass("pl_button_collapse-open");
                toggler.addClass("pl_button_collapse-close");
            }
        });
    },

    events: function () {
        var slick_options = this.config.services_slick_slider;

        // Start spy scroll
        this.navigationSpyScroll();

        // Start accordion component
        this.accordion();

        // Start get free quote form scripts
        this.get_free_quote();

        // Generate services slick slider
        $("#pl_services").slick(slick_options);

        // Remove drag ability for images
        $("img").attr("draggable", false);

        // Register read more elements
        new Readmore(document.querySelectorAll(".pl_readmore"), {
            speed: 500,
            collapsedHeight: "71px",
            defaultHeight: "71px",
            moreLink: "<a href=\"#\" class=\"pl_button pl_button_link px-0 pb-0 d-inline-block\">Read more <i class=\"fas fa-chevron-down\"></i></a>",
            lessLink: "<a href=\"#\" class=\"pl_button pl_button_link px-0 pb-0 d-inline-block\">Close <i class=\"fas fa-chevron-up\"></i></a>"
        });

        if ($(document).width() <= 450) {
            new Readmore(document.getElementById("pl_readmore_languages"), {
                speed: 1000,
                collapsedHeight: "250px",
                defaultHeight: "250px",
                moreLink: "<a href=\"#\" class=\"pl_button pl_button_link d-inline-block\">Read more <i class=\"fas fa-chevron-down\"></i></a>",
                lessLink: "<a href=\"#\" class=\"pl_button pl_button_link d-inline-block\">Close <i class=\"fas fa-chevron-up\"></i></a>"
            });
        }
    },

    init: function () {
        this.events();
    }
};

app.init();