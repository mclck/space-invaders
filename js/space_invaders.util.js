"use strict";

var DISPLAY_WIDTH = 800;
var DISPLAY_HEIGHT = 600;

var SHIP_GROUND_LEVEL = DISPLAY_HEIGHT - 100;

var SOUND_ON = (typeof SOUND_ON !== "undefined") ? SOUND_ON : true;

var DEBUG_BLOCK_PAINTER = (typeof DEBUG_BLOCK_PAINTER !== "undefined") ? DEBUG_BLOCK_PAINTER : false;
var TEXT_OVERLAY_COLOR = (typeof TEXT_OVERLAY_COLOR !== "undefined") ? TEXT_OVERLAY_COLOR : "#00ff00"; // "white";

var space_invaders = (typeof space_invaders !== "undefined") ? space_invaders : {};

space_invaders.util = (function () {

    // This one works great on desktop, but the audio tag doesn't work that well on mobile.
    // Hence, use howler.js, instead.
    // https://github.com/goldfire/howler.js

    // Inspired and borrowed from: http://www.storiesinflight.com/html5/audio.html
    // var SoundMachine = function(maxChannels) {
    //     var count = maxChannels || 5;

    //     if (!SOUND_ON) {
    //         this.play = function () {}
    //     }
    //     else {
    //         var audioChannels = [];

    //         for (var a = 0; a < count; a++) {
    //             audioChannels[a] = {
    //                 channel: document.createElement('audio'), //new Audio(), // to avoid "Error"
    //                 finished: -1
    //             }
    //         }

    //         var play = function (channel, domElt) {
    //             channel.src = domElt.src;
    //             channel.load();
    //             channel.play();
    //         };

    //         this.play = function (soundId) {
    //             var domElt = document.getElementById(soundId);
    //             // domElt.play();
    //             if (1) {
    //                 for (var a = 0; a < audioChannels.length; a++) {
    //                     var now = new Date().getTime();
    //                     if (audioChannels[a].finished < now) {
    //                         audioChannels[a].finished = now + 1000 * domElt.duration;
    //                         var channel = audioChannels[a].channel;
    //                         play(channel, domElt);
    //                         break;
    //                     }
    //                 }                    
    //             }
    //         };
    //     }
    // };

    var SoundMachine = function() {
        var sound = new Howl({
            src: ['sounds/sprite.mp3', 'sounds/sprite.wav', 'sounds/sprite.ogg' /* OGG at end: since Safari/ios doesn't like otherwise*/],

            sprite: {
                shootSound: [0, 370],
                explosionSound: [400, 1195-370-50], 
                invaderKilledSound: [1150, 350],
                fastInvader1Sound: [1550, 100],
                fastInvader2Sound: [1650, 100],
                fastInvader3Sound: [1750, 100]
            }
        });

        this.play = function(soundId) {
            sound.play(soundId);
        };
    }

    var Display = function() {
        var canvas = document.getElementById('invaderCanvas');
        var ctx = canvas.getContext('2d');

        this.fillRect = function (bitmap) {
            ctx.fillStyle = bitmap.color;
            ctx.fillRect(bitmap.x, bitmap.y, bitmap.width, bitmap.height);
        };

        this.paintImage = function (bitmap) {
            // ctx.drawImage(bitmap.image, bitmap.x, bitmap.y);
            // stretched!        
            ctx.drawImage(bitmap.image, bitmap.x, bitmap.y, bitmap.width, bitmap.height);
        };

        this.drawCenteredText = function (text, y, fontSize, color, bold) {
            var size = fontSize || 14;
            bold = (bold) ? "Bold " : "";

            ctx.save();
            ctx.fillStyle = color;
            ctx.font = bold + size + "pt Arial";
            var width = ctx.measureText(text).width;
            ctx.restore();

            var x = (DISPLAY_WIDTH - width) / 2;

            this.drawText(text, x, y, size, color, bold);
        };

        this.drawText = function (text, x, y, fontSize, color, bold) {
            var size = fontSize || 14;
            color = color || TEXT_OVERLAY_COLOR;
            bold = (bold) ? "Bold " : "";

            ctx.save();
            ctx.fillStyle = color;
            ctx.font = bold + size + "pt Arial";
            ctx.fillText(text, x, y);
            ctx.restore();
        }
    };

    var CanvasPainter = function() {
        var display = new Display();

        var debug = DEBUG_BLOCK_PAINTER;

        this.paint = function (bitmap, drawImage) {
            if (debug) {
                if (!bitmap.visible || !drawImage) {
                    display.fillRect(bitmap);
                }
                if (drawImage) {
                    display.paintImage(bitmap);
                }
            }
            if (bitmap.visible) {
                if (drawImage) {
                    display.paintImage(bitmap);
                } else {
                    display.fillRect(bitmap);
                }
            }
        };

        this.paintBackground = function () {
            display.fillRect({
                color: "black",
                x: 0,
                y: 0,
                width: DISPLAY_WIDTH,
                height: DISPLAY_HEIGHT
            });

            var debug = false;
            if (debug) {
                var spriteBounds = {
                    top: 0,
                    right: DISPLAY_WIDTH - 100,
                    bottom: SHIP_GROUND_LEVEL,
                    left: 50
                };
                display.fillRect({
                    color: "rgb(64, 64, 64)",
                    x: spriteBounds.left,
                    y: spriteBounds.top,
                    width: spriteBounds.right // should be:  spriteBounds.right - spriteBounds.left?
                    ,
                    height: spriteBounds.bottom - spriteBounds.top
                });
            }
        };

        this.drawText = function (text, x, y, fontSize, color, bold) {
            display.drawText(text, x, y, fontSize, color, bold);
        };

        this.drawTextOverlay = function (title, subtitle) {
            display.drawCenteredText(title, 200, 40, TEXT_OVERLAY_COLOR, true);
            display.drawCenteredText(subtitle, 250, 14);
        }
    }

    var soundMachine = new SoundMachine();

    return {
        soundMachine: soundMachine,
        CanvasPainter: CanvasPainter
    }

})();
