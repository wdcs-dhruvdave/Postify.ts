"use client";

import Footer from "@/components/layout/Footer";
import { motion } from "framer-motion";
import Link from "next/link";
import { isAuthenticated } from "@/utils/auth";
import { CONTENT, LABELS, ROUTES, CONFIG } from "@/constants/index";

export default function HomePage() {
  const isAuth = isAuthenticated();
  return (
    <>
      <section className="min-h-screen bg-gradient-to-br from-white to-blue-50 px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <motion.h1
            className="text-5xl md:text-6xl font-extrabold mb-4 text-gray-900"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: CONFIG.ANIMATION.DELAY_SHORT }}
          >
            {CONTENT.HOMEPAGE.HERO.TITLE}
          </motion.h1>

          <motion.p
            className="text-lg text-gray-600 mb-8 px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: CONFIG.ANIMATION.DELAY_MEDIUM }}
          >
            {CONTENT.HOMEPAGE.HERO.SUBTITLE}
          </motion.p>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: CONFIG.ANIMATION.DELAY_LONG }}
            className="mb-10"
          >
            <Link href={isAuth ? ROUTES.FEED : ROUTES.FEED}>
              <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-full shadow-lg hover:bg-blue-700 transition">
                {LABELS.BUTTONS.GET_STARTED}
              </button>
            </Link>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-10">
          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.CREATE_POSTS.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.CREATE_POSTS.DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.FOLLOW_USERS.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.FOLLOW_USERS.DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.MEDIA_UPLOADS.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.MEDIA_UPLOADS.DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.COMMENTS_LIKES.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.COMMENTS_LIKES.DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.EXPLORE_FEED.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.EXPLORE_FEED.DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            className="p-6 bg-white rounded-xl shadow hover:shadow-md transition text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {CONTENT.HOMEPAGE.FEATURES.USER_PROFILES.TITLE}
            </h3>
            <p className="text-gray-600">
              {CONTENT.HOMEPAGE.FEATURES.USER_PROFILES.DESCRIPTION}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {CONTENT.HOMEPAGE.HOW_IT_WORKS.TITLE}
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-5 rounded-lg shadow">
              <h4 className="font-semibold text-blue-600 mb-2">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.CREATE_ACCOUNT.TITLE}
              </h4>
              <p className="text-gray-600">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.CREATE_ACCOUNT.DESCRIPTION}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h4 className="font-semibold text-blue-600 mb-2">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.START_POSTING.TITLE}
              </h4>
              <p className="text-gray-600">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.START_POSTING.DESCRIPTION}
              </p>
            </div>
            <div className="bg-white p-5 rounded-lg shadow">
              <h4 className="font-semibold text-blue-600 mb-2">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.GROW_NETWORK.TITLE}
              </h4>
              <p className="text-gray-600">
                {CONTENT.HOMEPAGE.HOW_IT_WORKS.STEPS.GROW_NETWORK.DESCRIPTION}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto mt-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {CONTENT.HOMEPAGE.TESTIMONIALS.TITLE}
          </h2>
          <div className="grid md:grid-cols-2 gap-6 text-left">
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-2 italic">
                {CONTENT.HOMEPAGE.TESTIMONIALS.USER1.QUOTE}
              </p>
              <p className="font-semibold text-gray-800">
                {CONTENT.HOMEPAGE.TESTIMONIALS.USER1.AUTHOR}
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <p className="text-gray-700 mb-2 italic">
                {CONTENT.HOMEPAGE.TESTIMONIALS.USER2.QUOTE}
              </p>
              <p className="font-semibold text-gray-800">
                {CONTENT.HOMEPAGE.TESTIMONIALS.USER2.AUTHOR}
              </p>
            </div>
          </div>
        </div>

        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-semibold mb-4 text-gray-800">
            {CONTENT.HOMEPAGE.CTA.TITLE}
          </h2>
          <Link href={ROUTES.SIGNUP}>
            <button className="px-8 py-3 bg-blue-700 text-white rounded-full hover:bg-blue-800 transition shadow-lg">
              {LABELS.BUTTONS.SIGN_UP_NOW}
            </button>
          </Link>
        </motion.div>
      </section>
      <Footer />
    </>
  );
}
