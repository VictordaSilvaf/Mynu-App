<?php

use App\Models\Store;

test('isComplete returns true when name, phones and colors are present', function () {
    $store = new Store;
    $store->name = 'Loja Teste';
    $store->phones = ['+5511999999999'];
    $store->colors = ['#000000'];

    expect($store->isComplete())->toBeTrue();
});

test('isComplete returns false when name is empty', function () {
    $store = new Store;
    $store->name = '';
    $store->phones = ['+5511999999999'];
    $store->colors = ['#000000'];

    expect($store->isComplete())->toBeFalse();
});

test('isComplete returns false when phones is empty', function () {
    $store = new Store;
    $store->name = 'Loja';
    $store->phones = [];
    $store->colors = ['#000000'];

    expect($store->isComplete())->toBeFalse();
});

test('isComplete returns false when colors is empty', function () {
    $store = new Store;
    $store->name = 'Loja';
    $store->phones = ['+5511999999999'];
    $store->colors = [];

    expect($store->isComplete())->toBeFalse();
});
