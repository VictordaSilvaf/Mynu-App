<?php

namespace App\DataTransferObjects\Subscription;

use Illuminate\Support\Collection;

final readonly class SubscriptionData
{
    public function __construct(
        public string $priceId,
        public string $paymentMethodId,
        public ?string $name = 'default',
        public ?int $quantity = 1,
        public ?Collection $metadata = null,
        public ?bool $skipTrial = false,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            priceId: $data['price_id'],
            paymentMethodId: $data['payment_method_id'],
            name: $data['name'] ?? 'default',
            quantity: $data['quantity'] ?? 1,
            metadata: isset($data['metadata']) ? collect($data['metadata']) : null,
            skipTrial: $data['skip_trial'] ?? false,
        );
    }

    public function toArray(): array
    {
        return [
            'price_id' => $this->priceId,
            'payment_method_id' => $this->paymentMethodId,
            'name' => $this->name,
            'quantity' => $this->quantity,
            'metadata' => $this->metadata?->toArray(),
            'skip_trial' => $this->skipTrial,
        ];
    }
}
