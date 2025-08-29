import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0">
          {/* Copyright */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} DashPro. All rights reserved.
          </div>

          {/* Credits */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 mx-1 text-red-500 fill-current" />
            <span>by Your Company</span>
          </div>

          {/* Links */}
          <div className="flex items-center space-x-4">
            <a
              href="#privacy"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="#contact"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
