import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "João Silva",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    comment: "Finalmente posso assistir tudo que quero sem precisar de várias assinaturas. Economia total!",
    rating: 5
  },
  {
    id: 2,
    name: "Maria Santos",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616c88c6a2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    comment: "A qualidade é incrível e o catálogo é imenso. Meus filhos adoram os desenhos e animes!",
    rating: 5
  },
  {
    id: 3,
    name: "Carlos Oliveira",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100",
    comment: "Uso em todos os dispositivos. A sincronização é perfeita e posso continuar assistindo onde parei.",
    rating: 5
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-dark-primary">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-in">
          O que nossos <span className="text-netflix-red">usuários</span> dizem
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-dark-secondary rounded-xl p-6 text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img 
                src={testimonial.avatar} 
                alt={testimonial.name} 
                className="w-16 h-16 rounded-full mx-auto mb-4 object-cover"
              />
              <p className="text-gray-300 mb-4">"{testimonial.comment}"</p>
              <h4 className="font-semibold mb-2">{testimonial.name}</h4>
              <div className="flex justify-center space-x-1 text-yellow-400">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
