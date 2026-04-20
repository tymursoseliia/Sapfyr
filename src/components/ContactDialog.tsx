'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ContactDialog({ open, onOpenChange }: ContactDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contactMethod: 'phone',
    telegramType: 'phone', // 'phone' или 'username'
    telegramUsername: '',
    car: '',
    budget: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Спасибо! Мы свяжемся с вами в ближайшее время.');
    onOpenChange(false);
    setFormData({
      name: '',
      phone: '',
      contactMethod: 'phone',
      telegramType: 'phone',
      telegramUsername: '',
      car: '',
      budget: '',
      message: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-[#0A2540]">
            Заявка на<br />консультацию
          </DialogTitle>
          <p className="text-center text-sm text-gray-600 pt-2">
            Бесплатно подберем автомобиль<br />
            по вашим критериям уже сегодня
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Name */}
          <Input
            placeholder="Имя"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-12"
          />

          {/* Contact Method */}
          <div>
            <RadioGroup
              value={formData.contactMethod}
              onValueChange={(value) => setFormData({ ...formData, contactMethod: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="phone" id="phone" />
                <Label htmlFor="phone" className="cursor-pointer">Телефон</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telegram" id="telegram" />
                <Label htmlFor="telegram" className="cursor-pointer">Telegram</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="cursor-pointer">WhatsApp</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Phone / Telegram input */}
          {formData.contactMethod === 'telegram' ? (
            <div className="space-y-3">
              <RadioGroup
                value={formData.telegramType}
                onValueChange={(value: string) => setFormData({ ...formData, telegramType: value })}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="phone" id="tg-phone" />
                  <Label htmlFor="tg-phone" className="cursor-pointer">Номер телефона</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="username" id="tg-username" />
                  <Label htmlFor="tg-username" className="cursor-pointer">Тег (@username)</Label>
                </div>
              </RadioGroup>

              {formData.telegramType === 'phone' ? (
                <div className="flex gap-2">
                  <div className="flex items-center gap-2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-md">
                    <span className="text-xl">🇷🇺</span>
                    <span className="text-gray-500">+7</span>
                  </div>
                  <Input
                    type="tel"
                    placeholder="(000) 000-00-00"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="h-12 flex-1"
                  />
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="@username"
                  value={formData.telegramUsername}
                  onChange={(e) => setFormData({ ...formData, telegramUsername: e.target.value })}
                  required
                  className="h-12"
                />
              )}
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="flex items-center gap-2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-md">
                <span className="text-xl">🇷🇺</span>
                <span className="text-gray-500">+7</span>
              </div>
              <Input
                type="tel"
                placeholder="(000) 000-00-00"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="h-12 flex-1"
              />
            </div>
          )}

          {/* Car Interest */}
          <Input
            placeholder="Какой автомобиль вас интересует"
            value={formData.car}
            onChange={(e) => setFormData({ ...formData, car: e.target.value })}
            className="h-12"
          />

          {/* Budget */}
          <Input
            placeholder="Ваш бюджет"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="h-12"
          />

          {/* Message */}
          <textarea
            placeholder="Сообщение"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0A7ABF] resize-none"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#0A7ABF] hover:bg-[#095A8F] text-white text-base font-medium"
          >
            Отправить
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
