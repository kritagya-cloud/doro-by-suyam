export default function Testimonials() {
  const quotes = [
    { name: "Asha", text: "Beautifully packaged — the recipient loved it." },
    { name: "Rohan", text: "Quality is great for the price. Fast shipping." },
    { name: "Neha", text: "Thoughtful designs and lovely colors." }
  ];
  return (
    <div className="testimonials">
      {quotes.map((q, i) => <blockquote key={i}><p>“{q.text}”</p><cite>— {q.name}</cite></blockquote>)}
    </div>
  );
}
