//src/utils/error.ts
// * Création d'une classe de base pour la géstion des erreur
class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

// * Erreur 404 - Ressource non trouvée
class NotFoundError extends AppError {
  // * On donne une valeur par defaut à notre message
  constructor(message = 'Ressource non trouvée') {
    // * Super appelle le constructeur de la classe parent AppError
    super(message, 404);
  }
}

// * Erreur 400 - Validation
class ValidationError extends AppError {
  details: string[];
  constructor(message = 'Données invalides', details: string[] = []) {
    super(message, 400);
    this.details = details;
  }
}

// * Fonctions utilitaires pour lancer des erreurs
function notFound(message: string): never {
  throw new NotFoundError(message);
}

export { AppError, NotFoundError, ValidationError, notFound };