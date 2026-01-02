'use client';

/**
 * TemplateSelector Component - Choose canvas template
 * @param {Object} props
 * @param {number} props.selectedId - Selected template ID
 * @param {Function} props.onSelect - Callback when template selected
 */
export function TemplateSelector({ selectedId, onSelect }) {
  return (
    <div className="space-y-2">
      {[
        { id: 1, name: 'Full Image', desc: 'Image fills the entire canvas' },
        { id: 2, name: 'Headline Top', desc: 'Headline above image' },
        { id: 3, name: 'Three Section', desc: 'Headline + Image + Subheadline' },
        { id: 4, name: 'Side Layout', desc: 'Image + Text side by side' },
      ].map((template) => (
        <button
          key={template.id}
          onClick={() => onSelect(template.id)}
          className={`w-full p-3 text-left rounded-lg transition ${
            selectedId === template.id
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <div className="font-semibold">{template.name}</div>
          <div className={`text-sm ${selectedId === template.id ? 'text-blue-100' : 'text-gray-600'}`}>
            {template.desc}
          </div>
        </button>
      ))}
    </div>
  );
}
