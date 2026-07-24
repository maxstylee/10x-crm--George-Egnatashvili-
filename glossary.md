# Glossary

1. **Session**
   A session uses `sessionStorage` (`crm_session`) to maintain the logged-in status of a user while navigating through pages.
   სესია გამოიყენება `sessionStorage`-ის (`crm_session`) საშუალებით, რათა შეინარჩუნოს მომხმარებლის ავტორიზებული სტატუსი გვერდებს შორის გადასვლისას.

2. **Fetch**
   Fetch is an asynchronous API function used in `clients.js` to request external client data from a remote server.
   Fetch არის ასინქრონული API ფუნქცია, რომელიც გამოიყენება `clients.js`-ში სერვერიდან კლიენტების მონაცემების გამოსათხოვად.

3. **LocalStorage**
   LocalStorage is a web storage API used in `storage.js` and `auth.js` to save users, clients, and theme settings locally in the browser.
   LocalStorage არის ვებ-შენახვის API, რომელიც გამოიყენება ბრაუზერში მომხმარებლების, კლიენტებისა და თემის პარამეტრების ლოკალურად შესანახად.

4. **Validation**
   Validation checks form inputs like email and password in `auth.js` to ensure they satisfy required format rules before submission.
   ვალიდაცია ამოწმებს ფორმაში შეყვანილ მონაცემებს (ელ-ფოსტა, პაროლი), რათა დარწმუნდეს, რომ ისინი აკმაყოფილებენ დადგენილ წესებს ფორმის გაგზავნამდე.

5. **Async / Await**
   Async and await keywords are used in `clients.js` to handle asynchronous operations cleanly when fetching API data.
   Async და Await საკვანძო სიტყვები გამოიყენება `clients.js`-ში ასინქრონული ოპერაციების მოხერხებულად და თანმიმდევრულად შესასრულებლად API-დან მონაცემების წამოღებისას.

6. **JSON**
   JSON (JavaScript Object Notation) is used to convert data objects into strings and parse retrieved data using `JSON.parse` and `JSON.stringify`.
   JSON (JavaScript Object Notation) გამოიყენება ობიექტების ტექსტურ ფორმატში გადასაყვანად და წაკითხული მონაცემების დასამუშავებლად `JSON.parse` და `JSON.stringify` ფუნქციებით.

7. **Event Listener**
   An event listener waits for specific DOM events like `DOMContentLoaded` or button clicks to trigger associated JavaScript handler functions.
   Event Listener ელოდება კონკრეტულ მოვლენას (მაგ. გვერდის ჩატვირთვას ან ღილაკზე დაჭერას), რათა გააშვას შესაბამისი JavaScript ფუნქცია.

8. **DOM Manipulation**
   DOM manipulation dynamically modifies HTML elements by reading, creating, or updating their styles and content using `document.getElementById` and `createElement`.
   DOM მანიპულაცია დინამიურად ცვლის HTML ელემენტებს მათი შინაარსისა და სტილების წაკითხვით, შექმნით ან განახლებით JavaScript-ის საშუალებით.

9. **Modal**
   A modal is a pop-up dialog box such as `appAlertModal` or `appConfirmModal` displayed over the page to show notifications or confirm actions.
   მოდალი არის ფანჯარა (მაგ. `appAlertModal` ან `appConfirmModal`), რომელიც გამოჩნდება გვერდის ზემოდან შეტყობინების საჩვენებლად ან მოქმედების დასადასტურებლად.

10. **Array Methods**
    Array methods like `map()`, `push()`, and `forEach()` are used throughout `clients.js` to manipulate, format, and render lists of clients.
    მასივის მეთოდები (მაგ. `map()`, `push()`, `forEach()`) გამოიყენება კლიენტების სიის დასამუშავებლად, დასაფილტრად და ეკრანზე გამოსატანად.
