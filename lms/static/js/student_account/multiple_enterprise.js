(function(define) {
    'use strict';
    define(['jquery', 'jquery.cookie'], function($) {
        var MultipleEnterpriseInterface = {

            urls: {
                learners: '/enterprise/api/v1/enterprise-learner/'
            },

            headers: {
                'X-CSRFToken': $.cookie('csrftoken')
            },

            /**
             * Fetch the learner data, then redirect the user to a enterprise selection page if multiple
             * enterprises were found.
             * @param  {string} user.
             * @param  {string} redirectUrl The URL to redirect to.
             */
            check: function(user, redirectUrl, nextUrl) {
                var data_obj = {user: user},
                    data = JSON.stringify(data_obj);
                var next = nextUrl || '/'
                $.ajax({
                    url: this.urls.learners + '?username=' + user,
                    type: 'GET',
                    contentType: 'application/json; charset=utf-8',
                    data: data,
                    headers: this.headers,
                    context: this
                }).fail(function(jqXHR) {
                    this.redirect(next);
                }).done(function(response) {
                    if (response.count > 1 && redirectUrl) {
                        this.redirect(redirectUrl);
                    } else {
                        this.redirect(next)
                    }
                });
            },

            /**
             * Redirect to a URL.  Mainly useful for mocking out in tests.
             * @param  {string} url The URL to redirect to.
             */
            redirect: function(url) {
                window.location.href = url;
            }
        };

        return MultipleEnterpriseInterface;
    });
}).call(this, define || RequireJS.define);
