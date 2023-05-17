// ==UserScript==
// @name         CUIT课程中心助手
// @namespace    https://cuit.edu.cn
// @version      1.3
// @author       ooyq
// @description  成都信息工程大学课程中心网课助手 自动完成课程
// @match        https://kczx.cuit.edu.cn/learn/course/spoc/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @license      Apache License 2.0
// ==/UserScript==

(function() {
    'use strict';

    // 获取URL中的courseId和subsectionId
    var urlParts = window.location.href.match(/\/spoc\/([a-zA-Z0-9]+)\/([a-zA-Z0-9]+)/);
    var courseId = urlParts[1];
    var subsectionId = urlParts[2];

    // 构建获取id的URL
    var idUrl = "https://kczx.cuit.edu.cn/learn/v1/learningsituation?courseId=" + courseId + "&subsectionId=" + subsectionId;

    // 获取id
    GM_xmlhttpRequest({
        method: "GET",
        url: idUrl,
        onload: function(response) {
            var data = JSON.parse(response.responseText);

            // 获取id
            var id = data.data.id;

            // 构建学习情况状态页面的URL
            var statusUrl = "https://kczx.cuit.edu.cn/learn/v1/learningsituation/status?id=" + id + "&status=2";

            // 获取学习情况状态页面的数据
            GM_xmlhttpRequest({
                method: "GET",
                url: statusUrl,
                onload: function(response) {
                    var statusData = JSON.parse(response.responseText);

                    // 判断学习情况状态页面的数据内容
                    if (statusData.status === 200 && statusData.message === "OK") {
                        // 如果课程已完成，则显示通知
                        GM_notification({
                            text: "课程已完成，请刷新查看",
                            title: "课程状态",
                            timeout: 2000, // 持续显示通知的时间（毫秒）
                            silent: true // 静音通知，不会发出声音
                        });
                    }
                }
            });
        }
    });
})();
