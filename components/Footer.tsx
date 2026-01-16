import Link from 'next/link'
import { FiFacebook, FiInstagram, FiTwitter, FiMail } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4">Sobre Nós</h3>
            <p className="text-gray-400">
              Sua loja online confiável para produtos de qualidade com os
              melhores preços.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products" className="hover:text-white">
                  Produtos
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-xl font-bold mb-4">Atendimento</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Frete e Entrega
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-white">
                  Rastrear Pedido
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FiFacebook size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <FiInstagram size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <FiTwitter size={24} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Email"
              >
                <FiMail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 E-Commerce. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}

