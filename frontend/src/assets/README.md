Put static images here (facility photos, logo, icons) and import them
directly in components, e.g.:

  import logo from "../assets/logo.svg";
  <img src={logo} alt="Commfix" />

Nothing references this folder yet — the sidebar/topbar currently use a
plain "C" text mark instead of a logo file, and report photos are still
a file-drop placeholder rather than a real preview. Swap those in once
you have real assets and image upload working.
