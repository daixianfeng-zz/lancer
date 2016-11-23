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
            onProgress: function(eFile){ },
            onComplete: function(err, xhr){ if(err){ console.log(err); } },
            onReset: function(){ },
            onTips: function(msg){ console.log(msg); },
            fileKey: 'files',
            typeReg: /^image/,
            maxSize: 2 * FileAPI.MB,
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
                            if(file.size > self.config.maxSize){
                                self.config.onTips('ERROR_MAX_SIZE');
                                return false;
                            }
                            return true;
                        }
                        self.config.onTips('ERROR_FILE_TYPE');
                        return false;
                    }, function(files, rejected){
                        if(files.length === 0){
                            return ;
                        }
                        self.clearFile();
                        self.config.onReset();
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
                var args = [];
                if(this.config.resizeArgs){
                    args = this.config.resizeArgs;
                    if(args.length === 3){
                        fileImg.resize(args[0],args[1],args[2]);
                    }else if(args.length === 2){
                        fileImg.resize(args[0],args[1]);
                    }
                }
                if(this.config.cropArgs){
                    args = this.config.cropArgs;
                    if(args.length === 4){
                        fileImg.crop(args[0],args[1],args[2],args[3]);
                    }else if(args.length === 2){
                        fileImg.crop(args[0],args[1]);
                    }
                }
                if(this.config.previewArgs){
                    args = this.config.previewArgs;
                    if(args.length === 2){
                        fileImg.preview(args[0],args[1]);
                    }else if(args.length === 1){
                        fileImg.preview(args[0]);
                    }
                }
                if(this.config.rotateArgs){
                    args = this.config.rotateArgs;
                    if(args.length === 1){
                        fileImg.rotate(args[0]);
                    }
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
                var cropperConfig = this.config.cropperConfig;
                this.$el.cropper(cropperConfig);
            },
            crop: function(){
                var $cutImg = this.$el.cropper('getCroppedCanvas');
                this.resultCanvas = $cutImg;
                this.resultImg = '';
                if(this.config.resultContainer){ $(this.config.resultContainer).append($cutImg); }
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
            pushFile: function(gFile){
                var self = this;
                gFile.pushFile(this.resultCanvas);
                this.resultCanvas.toBlob(function (blob) {
                    var curTime = +new Date();
                    // var tmpFile = new File([blob], 'img'+curTimestamp+'.png');
                    var tmpFile = blob;
                    tmpFile.name = 'img'+(+curTime)+'.png';
                    tmpFile.lastModified = +curTime;
                    tmpFile.lastModifiedDate = curTime;
                    tmpFile.constructor = File;
                    gFile.pushFile(tmpFile);
                });
            },
            upload: function(gFile){
                gFile.upload();
            }
        };

        
        window.gUpload = gUpload = {
            GFile: GFile,
            GCut: GCut
        };
        return gUpload;
    }
})();