/*!
 * Copyright 2014 Riccardo Massera (TheCoder4.Eu)
 * BootsFaces JS
 * author: TheCoder4.eu
 */

BsF = {};
BsF.ajax = {};
BsF.onSuccessCallback = {};

BsF.ajax.onevent = function(data) {
	// console.log(data.status);
	// if (data.status === 'begin') {
	// requestOngoing = true;
	// onCompleteCallbacks = [];
	// }
	if (data.status === 'complete') {
		if ($.blockUI && $.blockUI != null) {
			$.unblockUI();
		}
	}
	// if (data.status === 'success') {
	// handleAjaxUpdates(data);
	// requestOngoing = false;
	// }
	if (data.status == "success") {
		var cid = data.source.id.replace(/[^a-zA-Z0-9]+/g, '_');
		var f = BsF.onSuccessCallback[cid];
		if (f && f != null && typeof (f) != 'undefined') {
			f();
		}
	}
};
BsF.ajax.cb = function(o, e, r, f) { // commandButton ajax helper (object,
	// event, [render], [oncomplete])
	BsF.ajax.callAjax(o, e, r, "@all", f, null);
}

/**
 * Initiates an asynchronous AJAX request. param eventType In the case of jQuery
 * events, JSF sends the wrong event type to the backend. The real event is put
 * in this parameter.
 */
BsF.ajax.callAjax = function(source, event, update, execute, oncomplete,
		eventType) { // commandButton ajax helper (object, event, [render],
	// [oncomplete])
	var argn = arguments.length;
	var oid = source.id;
	var cid = oid.replace(/[^a-zA-Z0-9]+/g, '_');
	var opts = {};
	if (eventType) {
		opts.params = "BsFEvent=" + eventType;
	}

	update = BsF.ajax.resolveJQuery(update);
	if (update && update != null) {
		opts.render = update;
	}

	execute = BsF.ajax.resolveJQuery(execute);
	if (execute && execute != null) {
		opts.execute = execute;
	}
	opts[oid] = oid;
	if (oncomplete && oncomplete != null) {
		BsF.onSuccessCallback[cid] = oncomplete;
	} else {
		BsF.onSuccessCallback[cid] = null;
	}
	opts.onevent = BsF.ajax.onevent;
	
	jsf.ajax.request(source, event, opts);
	if ($.blockUI && $.blockUI != null) {
		var message = $.blockUI.defaults.message;
		$.blockUI();
	}
	return false;
};

BsF.ajax.resolveJQuery = function(update) {
	if (typeof (update) == 'undefined')
		return "";
	if (update == null)
		return "";
	var newUpdate = "";
	var parts = update.split(" ");
	for (i = 0; i < parts.length; i++) {
		part = parts[i];
		if ((part.indexOf("@(") == 0)
				&& (part.lastIndexOf(")") == part.length - 1)) {
			var jqueryexp = part.substring(2, part.length - 1);
			var jQueryObjects = $(jqueryexp);
			if (jQueryObjects) {
				jQueryObjects.each(function(index, element) {
					newUpdate += " " + element.id;
				});

			}
		} else
			newUpdate += part + " ";
	}
	return newUpdate.trim();
};

BsF.ajax.paginate = function(o, e, v, c, r) { // Paginator ajax helper
	// (object, event, value,
	// component, render)
	var opts = {};
	opts.execute = '@this';
	opts.render = r;
	opts[c] = v;
	jsf.ajax.request(c, e, opts);
	return false;
};

/* DatePicker Bootstrap Icon support */
if ($.datepicker) {
	var generateHTML_orig = $.datepicker._generateHTML;

	$.datepicker._generateHTML = function() {
		var ret = generateHTML_orig.apply(this, arguments); // alert(ret);
		ret = ret
				.replace(
						/<span\s+class='ui-icon\s+ui-icon-circle-triangle-w'\s*>[^<]+<\/span>/,
						'<span class="glyphicon glyphicon-chevron-left"></span>');
		ret = ret
				.replace(
						/<span\s+class='ui-icon\s+ui-icon-circle-triangle-e'\s*>[^<]+<\/span>/,
						'<span class="glyphicon glyphicon-chevron-right"></span>');
		return ret;
	};
}

/* JQuery escaping utility for id's */
function jq( myid ) {
    return "#" + myid.replace( /(:|\.|\[|\]|,)/g, "\\$1" );
}

/* tree support method to convert data object to state string */
function treeDataMapper(data) {
	console.log(data);
	var sep = "|#*#|";
	if(data && data !== "undefined") {
		return data.nodeInternalId + sep + 
			   data.text + sep + 
			   data.state.checked + sep + 
			   data.state.disabled + sep + 
			   data.state.expanded + sep + 
			   data.state.selected;
	}
	return "";
}
