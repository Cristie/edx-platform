define(['edx-ui-toolkit/js/utils/spec-helpers/ajax-helpers', 'js/student_account/multiple_enterprise'],
    function(AjaxHelpers, MultipleEnterpriseInterface) {
        'use strict';

        describe('MultipleEnterpriseInterface', function() {
            var LEARNER_URL = '/enterprise/api/v1/enterprise-learner/?username=test-learner',
                NEXT_URL = '/',
                REDIRECT_URL = '/enterprise/select/active/';

            beforeEach(function() {
                // Mock the redirect call
                spyOn(MultipleEnterpriseInterface, 'redirect').and.callFake(function() {});
            });

            it('gets learner information and checks redirect to enterprise selection page', function() {
                // Spy on Ajax requests
                var requests = AjaxHelpers.requests(this);

                // Attempt to fetch a learner
                MultipleEnterpriseInterface.check('test-learner', REDIRECT_URL, NEXT_URL);

                // Expect that the correct request was made to the server
                AjaxHelpers.expectRequest(
                    requests,
                    'GET',
                    LEARNER_URL,
                    null
                );

                // Simulate a successful response from the server
                AjaxHelpers.respondWithJson(requests, {count: 2});

                // Verify that the user was redirected correctly
                expect(MultipleEnterpriseInterface.redirect).toHaveBeenCalledWith(REDIRECT_URL);
            });

            it('gets learner information and checks that enterprise selection page is bypassed', function() {
                // Spy on Ajax requests
                var requests = AjaxHelpers.requests(this);

                // Attempt to fetch a learner
                MultipleEnterpriseInterface.check('test-learner', REDIRECT_URL, NEXT_URL);

                // Expect that the correct request was made to the server
                AjaxHelpers.expectRequest(
                    requests,
                    'GET',
                    LEARNER_URL,
                    null
                );

                // Simulate a successful response from the server
                AjaxHelpers.respondWithJson(requests, {count: 1});

                // Verify that the user was redirected correctly
                expect(MultipleEnterpriseInterface.redirect).toHaveBeenCalledWith(NEXT_URL);
            });

            it('correctly redirects the user if learner information call fails', function() {
                // Spy on Ajax requests
                var requests = AjaxHelpers.requests(this);

                // Attempt to fetch a learner
                MultipleEnterpriseInterface.check('test-learner', REDIRECT_URL, NEXT_URL);

                // Simulate an error response from the server
                AjaxHelpers.respondWithError(requests);

                // Verify that the user was redirected
                expect(MultipleEnterpriseInterface.redirect).toHaveBeenCalledWith(NEXT_URL);
            });
        });
    }
);
