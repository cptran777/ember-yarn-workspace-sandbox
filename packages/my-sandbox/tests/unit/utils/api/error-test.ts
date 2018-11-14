import apiError from 'my-sandbox/utils/api/error';
import { module, test } from 'qunit';

module('Unit | Utility | api/error', function() {
  test('it works', function(assert) {
    let result = apiError({} as Response);
    assert.ok(result);
  });
});
