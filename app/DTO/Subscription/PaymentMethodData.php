<?php

namespace App\DTO\Subscription;

final readonly class PaymentMethodData
{
    public function __construct(
        public string $paymentMethodId,
        public ?bool $setAsDefault = true,
    ) {}

    public static function fromRequest(array $data): self
    {
        return new self(
            paymentMethodId: $data['payment_method_id'],
            setAsDefault: $data['set_as_default'] ?? true,
        );
    }

    public function toArray(): array
    {
        return [
            'payment_method_id' => $this->paymentMethodId,
            'set_as_default' => $this->setAsDefault,
        ];
    }
}
