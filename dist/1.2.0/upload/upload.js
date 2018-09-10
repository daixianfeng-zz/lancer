;(function(){
    var uploadFile = {};
    if ( typeof define === "function" && define.amd ) {
        define( 'uploadFile', ['require', 'jquery', 'G', 'FileAPI', 'gTips'], function(require) {
            factory(require('jquery'), require('G'), require('FileAPI'), require('gTips'));
            return uploadFile;
        } );
    }else if ( typeof module === "object" && typeof module.exports === "object" ) {
        factory(require('jquery'), require('G'), require('FileAPI'), require('gTips'));
        module.exports = uploadFile;
    }else{
        factory(window.jQuery, window.G, window.FileAPI, window.gTips);
    }
    function factory($, G){
        uploadFile = function(dropzone, filebtn, config){
            var conf = $.extend({}, {
                url: '',
                headers: {},
                fileKey: 'file',
                constData: {acl:'public', isWaterMark:0},
                dropBg: '#f1f1f1',
                chunkSize: 0,
                chunkUploadRetry: 1
            }, config);
            var upload = function(files){
                if( files.length ){
                    var fileObj = {};
                    fileObj[conf.fileKey] = files;
                    FileAPI.upload({
                        url: conf.url,
                        headers: conf.headers,
                        data: conf.constData,
                        files: fileObj,
                        chunkSize: conf.chunkSize * FileAPI.KB,
                        chunkUploadRetry: conf.chunkUploadRetry,
                        progress: function(evt){
                            conf.onProgress && conf.onProgress(evt);
                        },
                        fileprogress: function(evt, file, xhr){
                            file.fileId = xhr.uid;
                            conf.onFileProgress && conf.onFileProgress(evt, file);
                        },
                        complete: function(err, xhr){
                            if(!err){
                                conf.onSuccess && conf.onSuccess(xhr);
                            }else{
                                conf.onFail && conf.onFail(xhr);
                            }
                        },
                        filecomplete: function(err, xhr, file){
                            var result = {};
                            try{
                                result = JSON.parse(xhr.response);
                            }catch(e){
                                result = {
                                    apiError: 0,
                                    msg: '',
                                    data: {
                                        error: 1,
                                        message: '上传链接中断'
                                    }
                                }
                            }
                            var info = {};
                            if(G.apiError(result, info) && !err){
                                file.fileId = xhr.uid;
                                conf.onFileSuccess && conf.onFileSuccess(result, file);
                            }else{
                                file.fileId = xhr.uid;
                                conf.onFileFail && conf.onFileFail(info, xhr, file);
                            }
                        }
                    });
                }
            };
            var filter = function(files){
                if(conf.onStart && conf.onStart(files, conf) !== true){
                    return;
                }
                FileAPI.filterFiles(files, function (file, info){
                    if(file.type && conf.fileTypeReg && !conf.fileTypeReg.test(file.type)){
                        gTips.error(conf.fileTips, conf.tipsArea);
                        return false;
                    }
                    if(file.name && conf.fileExtReg && !conf.fileExtReg.test(file.name)){
                        gTips.error(conf.fileTips, conf.tipsArea);
                        return false;
                    }
                    if(conf.maxSize && file.size > conf.maxSize * FileAPI.KB){
                        gTips.error(conf.fileTips, conf.tipsArea);
                        return false;
                    }
                    if(conf.onFileStart && conf.onFileStart(file) !== true){
                        return false;
                    }
                    return true;
                }, function (files, rejected){
                    upload(files);
                });
            };
            FileAPI.event.dnd(dropzone, function(over){
                dropzone.style.backgroundColor = over ? conf.dropBg : '';
            }, function (files){
                filter(files);
            });

            FileAPI.event.on(filebtn, 'change', function (evt){
                var files = FileAPI.getFiles(evt);
                filter(files);
            });
        };

        window.uploadFile = uploadFile;
    }
})();