import React from "react";

import gbv_6 from "../assets/gbv-6.png";
import gbv_7 from "../assets/gbv-7.png";
import gbv_9 from "../assets/gbv-9.png";
import gbv_10 from "../assets/gbv-10.png";
import gbv_11 from "../assets/gbv-11.png";
import gbv_12 from "../assets/gbv-12.png";

const sections = [
  {
    title: "📚 Educational Materials",
    image: gbv_10,
    content:
      "Educational materials play a crucial role in raising awareness and understanding of gender-based violence (GBV). These include brochures, infographics, explainer videos, and case studies that break down complex topics into accessible information. Designed for diverse audiences—such as youth, community leaders, health workers, and educators—these resources help clarify misconceptions, promote prevention, and empower individuals to take informed action.",
    links: [
      {
        title: "GBV Resource Pack (Kenya Gov)",
        url: "https://gender.go.ke/sites/default/files/publications/GBV-Resource-Pack-13-Sept-w-3mm-bleed.pdf",
      },
      {
        title: "Safe Schools Handbook (UNGEI)",
        url: "https://www.ungei.org/sites/default/files/2023-07/385968eng.pdf",
      },
      {
        title: "Youth Engagement Toolkit (TfG)",
        url: "https://www.togetherforgirls.org/en/resources/every-hour-matters-youth-engagement-toolkit-kenya",
      },
      {
        title: "SRGBV Kenya Fact Sheet",
        url: "https://www.ungei.org/publication/kenya-fact-sheet-school-related-gender-based-violence",
      },
      {
        title: "YWCA Social Media Toolkit",
        url: "https://www.ywcakenya.org/pdf/YWCA_Kenya_16_Days_Social_Media_Toolkit.pdf",
      },
    ],
  },
  {
    title: "🧠 Myth vs. Fact",
    image: gbv_11,
    content:
      "Gender-based violence (GBV) is surrounded by many myths that can prevent survivors from seeking help and perpetuate harmful attitudes. For example, myths like 'GBV only happens to women,' 'it's only abuse if it's physical,' or 'the survivor is to blame' are not true. In reality, GBV can affect anyone, includes emotional and economic abuse, and responsibility always lies with the perpetrator. Replacing myths with facts helps reduce stigma, encourages support for survivors, and promotes a more informed and compassionate response.",
  },
  {
    title: "🧍🏽‍♀️🧍🏾 How to Recognize Abuse",
    image: gbv_9,
    content:
      "Recognizing abuse involves being aware of various warning signs that may indicate someone is experiencing gender-based violence. These signs can include unexplained injuries, frequent absences from work or school, sudden changes in mood or behavior, withdrawal from friends and family, or signs of fear around a particular person. Abuse is not always physical—it can also be emotional, psychological, sexual, or financial. Trust your instincts: if something feels wrong, it’s important to reach out for help or support others in doing so.",
  },
  {
    title: "📘 Know Your Rights",
    image: gbv_7,
    content:
      "Everyone has the right to safety, dignity, and justice. If you experience or witness gender-based violence (GBV), you have the right to report it, seek protection, and access support services. Laws protect you from all forms of abuse—physical, emotional, sexual, or economic. You can request a protection order, receive medical and psychological care, and get legal aid. Understanding your rights empowers you to take action and ensures you are treated fairly and respectfully.",
  },
  {
    title: "📅 Campaign and Event Highlights",
    image: gbv_12,
    content:
      "Discover key campaigns raising awareness about gender-based violence (GBV), such as the '16 Days of Activism Against Gender-Based Violence,' community forums, school debates, and local marches. These initiatives aim to spark conversations, mobilize communities, and drive collective action to end GBV. Stay informed about upcoming events and learn how you can participate or support ongoing efforts.",
  },
  {
    title: "🌍 Culturally Sensitive Education",
    image: gbv_6,
    content:
      "Culturally sensitive education about gender-based violence (GBV) recognizes and respects the unique beliefs, traditions, and social norms of different communities. By tailoring messages and materials to local languages, customs, and values, these educational efforts ensure that information is accessible, relatable, and effective. This approach helps break down barriers to understanding, encourages open dialogue, and fosters community-driven solutions to prevent and address GBV in a way that is meaningful and respectful to all.",
  },
  {
    title: "👥 Engage and Share",
    image:
      "data:image/jpeg;base64,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",
    content:
      "Our platform provides a secure and confidential space for survivors and witnesses to report Gender-Based Violence (GBV) incidents. By sharing your experience, you help raise awareness, support others, and strengthen collective action against violence.",
  },
];

const EducationalSection = () => {
  return (
    <div className='py-12 px-4 sm:px-6 lg:px-16 space-y-16 bg-gray-50'>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`flex flex-col lg:flex-row ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          } items-center gap-8`}>
          <div className='w-full lg:w-1/2'>
            <img
              src={section.image}
              alt={section.title}
              className='rounded-2xl shadow-lg object-cover w-full h-64 sm:h-80 lg:h-96'
            />
          </div>
          <div className='w-full lg:w-1/2 space-y-4'>
            <h2 className='text-2xl font-bold text-gray-800'>
              {section.title}
            </h2>
            <p className='text-gray-700 text-lg'>{section.content}</p>
            {section.links && (
              <div className='mt-4 space-y-2'>
                {section.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block text-blue-600 hover:underline text-base font-medium'>
                    🔗 {link.title}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationalSection;
