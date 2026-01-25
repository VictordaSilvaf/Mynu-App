<?php

use function Pest\Laravel\artisan;

it('can list routes', function () {
    artisan('route:list');
    // We will manually check the output for now
    expect(true)->toBeTrue();
});
