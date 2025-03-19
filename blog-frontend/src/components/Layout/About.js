import React, { useEffect, useState } from "react";
import "../Layout/About.css";

export default function About() {
  const [articleCount, setArticleCount] = useState(0);
  const [writerCount, setWriterCount] = useState(0);
  const [readerCount, setReaderCount] = useState(0);

  useEffect(() => {
    const totalArticles = 1000;
    const totalWriters = 500;
    const totalReaders = 200000;

    let startArticles = 0;
    let startWriters = 0;
    let startReaders = 0;

    const interval = setInterval(() => {
      startArticles += 50;
      startWriters += 30;
      startReaders += 10000;

      if (startArticles > totalArticles) startArticles = totalArticles;
      if (startWriters > totalWriters) startWriters = totalWriters;
      if (startReaders > totalReaders) startReaders = totalReaders;

      setArticleCount(startArticles);
      setWriterCount(startWriters);
      setReaderCount(startReaders);

      if (
        startArticles === totalArticles &&
        startWriters === totalWriters &&
        startReaders === totalReaders
      ) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);
  
  const displayReaders = readerCount >= 1000
    ? `${(readerCount / 1000).toFixed(0)}K+`
    : `${readerCount}+`;

  return (
    <section className="about">
      {/* Hero sekcija sa pozadinskom slikom */}
      <header className="about__hero">
        <div className="about__overlay">
          <h1>About Us</h1>
          <p>Your daily dose of inspiration, knowledge & community.</p>
        </div>
        {/* Stats prikazani transparentno preko hero slike */}
        <div className="about__stats-container">
          <div className="about__card">
            <h3>{articleCount}+</h3>
            <small>Articles Published</small>
          </div>
          <div className="about__card">
            <h3>{writerCount}+</h3>
            <small>Active Writers</small>
          </div>
          <div className="about__card">
            <h3>{displayReaders}</h3>
            <small>Monthly Readers</small>
          </div>
        </div>
      </header>

      <article className="about__content">
        <p>
          <strong>MyBlog</strong> is more than just a blog — it’s a space where writers and readers 
          come together to share ideas, spark creativity, and build meaningful connections.
        </p>
      </article>


    </section>
  );
}
