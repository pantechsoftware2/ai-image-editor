import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

/**
 * BrandModal Component - Confirms extracted brand data
 */
export function BrandModal({
  open,
  brandData,
  onConfirm,
  onClose,
}: {
  open: boolean;
  brandData: any;
  onConfirm: (data: any) => void;
  onClose: () => void;
}) {
  const [data, setData] = useState(brandData);

  const handleConfirm = () => {
    onConfirm(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Brand Data</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Brand Name */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Brand Name</label>
            <input
              type="text"
              value={data.brandName}
              onChange={(e) => setData({ ...data, brandName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white"
            />
          </div>

          {/* Colors */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Brand Colors</label>
            <div className="flex gap-2">
              {data.colors.map((color: string, idx: number) => (
                <div key={idx} className="flex-1">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => {
                      const newColors = [...data.colors];
                      newColors[idx] = e.target.value;
                      setData({ ...data, colors: newColors });
                    }}
                    className="w-full h-10 rounded cursor-pointer border border-slate-600"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Logo */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Logo Preview</label>
            {data.logo ? (
              <img
                src={data.logo}
                alt="Brand Logo"
                className="w-full h-24 object-contain bg-slate-700 rounded p-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23475569" width="100" height="100"/%3E%3Ctext x="50" y="50" font-size="12" fill="%239CA3AF" text-anchor="middle" dy=".3em"%3ENo Logo%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <div className="w-full h-24 bg-slate-700 rounded flex items-center justify-center text-slate-400 text-sm">
                No logo found
              </div>
            )}
          </div>

          {/* Vibe */}
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">Brand Vibe</label>
            <select
              value={data.vibe}
              onChange={(e) => setData({ ...data, vibe: e.target.value })}
              className="w-full px-3 py-2 bg-slate-700 rounded border border-slate-600 text-white"
            >
              <option>Tech</option>
              <option>Fashion</option>
              <option>Finance</option>
              <option>Food</option>
              <option>Modern</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
