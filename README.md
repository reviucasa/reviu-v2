# 🏠 ReviuCasa

**ReviuCasa** is an open source homes review platform mainly for tenants who are searching for honest reviews about rental flats. It helps tenants in Spain discover trustworthy agencies and rental properties through community-shared experiences.

By opening the project’s source code, we aim to foster a development community aligned with our values of social justice, transparency, and mutual support. Therefore, we will only accept contributions that reinforce these principles and help improve the experience for tenants and responsible landlords committed to doing things right.

We reserve the right to reject contributions that do not respect these values or that may compromise Reviu’s mission to make the housing market fairer and more transparent.

This project is licensed under the **GPL v3** and built and powered by [IDRA](https://idrabcn.com/), the Barcelona Urban Research Institute.

## ✨ Features

* 🗘️ Interactive map with agency and homes reviews by location
* 🔍 Address and agency search functionality
* 📝 Submit and browse reviews from real users
* 🔐 Firebase Authentication and Firestore integration
* 📌 Real-time connection to the Spanish land registry
* 🌐 Optimized for SEO and Open Graph previews

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/reviucasa/reviu-v2
cd reviu-v2
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Firebase and Configure `.env`

To use your own Firebase backend:

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. In the project dashboard, go to **Project Settings > General** and scroll down to **Your apps**.
3. Click **&lt;/&gt; (Web)** to register a new app.
4. Firebase will generate your configuration values — copy them.

Now, create a `.env` file at the root of your project and paste the config like this:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

You can now connect your own Firebase instance to the ReviuCasa frontend.

> 🔐 Never commit your `.env` file. It is ignored by `.gitignore`.

### 4. Start the Dev Server

```bash
npm run dev
```

Your app will be running at `http://localhost:3000`

---

## 🔐 Firebase Security Rules

You can find the Firestore and Storage security rules in:

- `firestore.rules`
- `storage.rules`

To deploy changes:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

---

## 🖠️ Tech Stack

* [Next.js 14](https://nextjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Firebase (Auth + Firestore + Storage + Functions)](https://firebase.google.com/)
* [TypeScript](https://www.typescriptlang.org/)

---

## 🤝 Contributing

We welcome contributions! To get started:

1. Fork this repo
2. Create a new branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request to the `dev` branch

---

## 📄 License

This project is licensed under the **GNU General Public License v3.0**
See the [`LICENSE`](./LICENSE) file for details.

---

## 🌍 Live Demo

Check it out live: [https://reviucasa.com](https://reviucasa.com)
