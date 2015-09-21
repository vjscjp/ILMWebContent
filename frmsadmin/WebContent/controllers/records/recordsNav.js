/*global define:true*/
define(["dojo/dom", "dojo/on", "dojo/_base/lang"], function(dom, on, lang) {
    "use strict";
    return {
        init: function() {
            /*var create = dom.byId("btnCreateRecord_recordsNav"),
            	modify = dom.byId("btnModifyRecord_recordsNav"),
                search = dom.byId("btnSearchRecords_recordsNav");*/
            on(this.btnCreateRecords_recordsNav, "click", lang.hitch(this, function(e) {
                this.transitionTo(e, "recordsCreate");
            }));
            on(this.btnModifyRecords_recordsNav, "click", lang.hitch(this, function(e) {
                this.transitionTo(e, "recordsViewModify");
            }));
            /*on(search, "click", lang.hitch(this, function(e) {
                this.transitionTo(e, "recordsSearch");
            }));*/
        },
        transitionTo: function(e, targetView) {
            var transOpts = {
                target: targetView,
                params: null
            };
            this.app.transitionToView(e.target, transOpts);
        }
    };
});
