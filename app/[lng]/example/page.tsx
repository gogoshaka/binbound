import type { Metadata } from "next";
import Link from 'next/link'


import { useTranslation } from '../../i18n'


export default  async function IndexPage({ params: { lng } }: {
  params: {
    lng: string;
  };
}) {
  const { t } = await useTranslation(lng, 'nav')
  return (
    <div>
      <h2 className="mb-3 text-3xl font-extrabold" >{t('how_it_works')}</h2>
      <ul role="list">
        <li>{t('how_it_works_step1')}</li>
        <li>{t('how_it_works_step2')}</li>
        <li>{t('how_it_works_step3')}</li>
      </ul>
      <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="/userprofile/form/compensation">{t('get_started')}</Link>

      <h2 className="mb-3 text-3xl font-extrabold" >{t('frequently_asked_questions')}</h2>
      <ul role="list">
        <li className="mb-1">
          <p className="text-xl font-bold">{t('faq_question1')}</p>
          <p>{t('faq_answer1')}</p>
        </li>
        <li className="mb-1">
          <p className="text-xl font-bold">{t('faq_question2')}</p>
          <p>{t('faq_answer2')}</p>
        </li>
      </ul>
    </div>
  );
}


