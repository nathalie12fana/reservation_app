import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 pt-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Section principale */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-yellow-500 transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/appartements" className="hover:text-yellow-500 transition-colors">
                  Appartements
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-yellow-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-yellow-500 transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>123 Rue Exemple, Yaoundé, Cameroun</li>
              <li>Email : <a href="mailto:contact@laminutdecode.com" className="hover:text-yellow-500">contact@laminutdecode.com</a></li>
              <li>Téléphone : <a href="tel:+237123456789" className="hover:text-yellow-500">+237 123 456 789</a></li>
            </ul>
          </div>

          {/* Réseaux sociaux */}
          <div>
            <h3 className="text-white font-bold mb-4">Suivez-nous</h3>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="hover:text-yellow-500 transition-transform hover:scale-110">
                <FaFacebookF size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-yellow-500 transition-transform hover:scale-110">
                <FaTwitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-yellow-500 transition-transform hover:scale-110">
                <FaInstagram size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bas de page */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} La Minute De Code. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
