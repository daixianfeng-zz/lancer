;(function(){
    var gUpload = window.gUpload || {};
    if ( typeof define === "function" && define.amd ) {
        define( 'gUpload', ['require', 'jquery', 'G', 'FileAPI', 'cropper'], function(require) {
            return factory(require('jquery'), require('G'), require('FileAPI'), require('cropper'));
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        module.exports = factory(require('jquery'), require('G'), require('FileAPI'), require('cropper'));
    }else{
        factory(window.jQuery, window.G, window.FileAPI, window.cropper);
    }
    function factory($, G, FileAPI, cropper){
        if (!HTMLCanvasElement.prototype.toBlob) {
            Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
                value: function (callback, type, quality) {
                    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
                    len = binStr.length,
                    arr = new Uint8Array(len);
                    for (var i=0; i<len; i++ ) {
                        arr[i] = binStr.charCodeAt(i);
                    }
                    callback( new Blob( [arr], {type: type || 'image/png'} ) );
                }
            });
        }
        var defaultFileConfig = {
            // chunkSize: 5 * FileAPI.MB,
            getUploadData: function(){ return {}; },
            onProgress: function(eFile){ console.log(eFile); },
            onComplete: function(err, xhr){ if(err){ console.log(err); }else{ console.log('upload complete'); } },
            fileKey: 'files',
            typeReg: /^image/,
            autoUpload: true,
            afterLoad: function(){},
        };
        var defaultCutConfig = {
            getUploadData: function(){ return {}; },
        };
        var GFile = function(el, config){
            this.el = $(el)[0];
            this.init();
            this.config = $.extend({}, defaultFileConfig, config);
            this.files = [];
        };
        GFile.prototype = {
            init: function(){
                var self = this;
                FileAPI.event.on(this.el, 'change', function(e){
                    var files = FileAPI.getFiles(e);
                    FileAPI.filterFiles(files, function(file, info){
                        if(self.config.typeReg.test(file.type)){
                            return true;
                        }
                        return false;
                    }, function(files, rejected){
                        self.clearFile();
                        if(files.length){
                            FileAPI.each(files, function(file){
                                var fileImg = FileAPI.Image(file);
                                self._crop(fileImg).get(function(err, imgCV){
                                    var $img = $('<img />');
                                    $img[0].src = imgCV.toDataURL("image/png");
                                    if(self.config.container){ $(self.config.container).append($img); }
                                    if(!self.config.autoUpload){
                                        self.config.afterLoad($img);
                                    }
                                });
                            });
                        }
                        if(self.config.autoUpload){
                            self.pushFile(files);
                            self.upload();
                        }
                    });
                });
            },
            pushFile: function(file){
                return this.files.push(file);
            },
            clearFile: function(){
                this.files = [];
            },
            upload: function(){
                var files = this.files;
                var self = this;
                var uploadData = self.config.getUploadData();
                var uplodaFile = {};
                uplodaFile[self.config.fileKey] = files;

                FileAPI.upload({
                    url: self.config.uploadUrl,
                    data: uploadData,
                    files: uplodaFile,
                    // chunkSize: self.config.chunkSize,
                    progress: function(eFile){
                        self.config.onProgress(eFile);
                    },
                    complete: function(err, xhr){
                        self.config.onComplete(err, xhr);
                    }
                });
            },
            _crop: function(fileImg){
                if(this.config.resizeArgs){
                    return fileImg.resize(this.config.resizeArgs);
                }
                if(this.config.cropArgs){
                    return fileImg.crop(this.config.cropArgs);
                }
                if(this.config.previewArgs){
                    return fileImg.preview(this.config.previewArgs);
                }
                if(this.config.rotateArgs){
                    return fileImg.rotate(this.config.rotateArgs);
                }
                return fileImg;
            }
        };
        
        var GCut = function(el, config){
            this.$el = $(el);
            this.config = $.extend({}, defaultCutConfig, config);
            this.resultCanvas = null;
            this.resultImg = null;
            this.init();
        };
        GCut.prototype = {
            init: function(){
                this.$el.cropper({
                    aspectRatio: 16 / 9,
                    crop: function(e) {}
                });
            },
            crop: function(){
                var $cutImg = this.$el.cropper('getCroppedCanvas');
                this.resultCanvas = $cutImg;
                this.resultImg = '';
                $(this.config.resultContainer).append($cutImg);
                return $cutImg;
            },
            canvasToImage: function(){
                if(this.resultImg){
                    return this.resultImg;
                }
                var image = new Image();
                image.src = this.resultCanvas.toDataURL("image/png");
                this.resultImg = image;
                return image;
            },
            pushFile: function(file){
                var self = this;
                file.pushFile(this.resultCanvas);
                this.resultCanvas.toBlob(function (blob) {
                    var curTime = +new Date();
                    // var tmpFile = new File([blob], 'img'+curTimestamp+'.png');
                    var tmpFile = blob;
                    tmpFile.name = 'img'+(+curTime)+'.png';
                    tmpFile.lastModified = +curTime;
                    tmpFile.lastModifiedDate = curTime;
                    tmpFile.constructor = File;
                    file.pushFile(tmpFile);
                });
            },
            upload: function(file){
                file.upload();
            }
        };

        window.gUpload = {
            GFile: GFile,
            GCut: GCut
        };
        return gUpload;
    }
})();