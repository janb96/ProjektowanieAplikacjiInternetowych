### Projekt indywidualny

## Użyte technologie:

- Baza danych MySQL
- Express.js
- Node.js
- Bootstrap4
- Font Awesome
- HTML5, CSS3
- Sequelize
- Passport (logowanie przez Facebook)

## Jak włączyć?

- 1.) Instalacja na komputerze MySQL
- 2.) Zaimportowanie pliku "rental.sql" do bazy danych
- 3.) W pliku `connect.js` ustawienie hasła do bazy danych
- 4.) W pliku `app.js` wpisanie prywatnego klucza i identyfikatora Facebook
- 5.) Wykonanie polecenia `npm install` (możliwe, że trzeba będzie
doinstalować np. sequelize)
- 6.) Wpisanie do przeglądarki `http://localhost:3000`, aplikacja powinna uruchomić się.

## Aplikacja składa się z:

### Panelu Administratora
##### (Dostęp poprzez link `http://localhost:3000/admin`)

- Dodawanie samochodów
- Modyfikacja danych samochodów
- Usuwanie samochodów
- Potwierdzanie rezerwacji
- Usuwanie rezerwacji
- Podgląd wszystkich rezerwacji

### Panelu Użytkownika
- Zarezerwowanie samochodu
- Usunięcie rezerwacji
- Podgląd swoich rezerwacji

Do obu Panelów loguje się poprzez Facebook, w bieżącej wersji programu, system nie odróżnia użytkownika od administratora.
