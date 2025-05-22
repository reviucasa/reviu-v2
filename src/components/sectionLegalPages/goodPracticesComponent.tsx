import { getTranslations } from "next-intl/server";

export async function GoodPracticesComponent({
  className,
}: {
  className?: string;
}) {
  const t = await getTranslations();

  return (
    <div className={className}>
      <h1 className="mb-10 text-4xl">{t("goodPractices.title")}</h1>
      <p>{t("goodPractices.welcome")}</p>
      <div className="flex flex-col gap-3 mb-10 p-4 my-4 border-2 border-secondary-500">
        <h5 className="my-2 font-extrabold">{t("goodPractices.summary")}</h5>
        <p className=" font-semibold">{t("goodPractices.forbiddenComments")}</p>
        <ul className="pl-3">
          <li className="flex">- {t("goodPractices.forbiddenComments1")}</li>
          <li className="flex">- {t("goodPractices.forbiddenComments2")}</li>
          <li className="flex">- {t("goodPractices.forbiddenComments3")}</li>
          <li className="flex">- {t("goodPractices.forbiddenComments4")}</li>
        </ul>
        <p>{t("goodPractices.summaryComment")}</p>
        <p>{t("goodPractices.summaryCommentsOfInterest")}</p>
        <p className=" font-semibold">{t("goodPractices.summaryAsTenant")}</p>
        <ol className="pl-3">
          <li className="flex">- {t("goodPractices.summaryAsTenant1")}</li>
          <li className="flex">- {t("goodPractices.summaryAsTenant2")}</li>
          <li className="flex">- {t("goodPractices.summaryAsTenant3")}</li>
          <li className="flex">- {t("goodPractices.summaryAsTenant4")}</li>
        </ol>
        <p className=" font-semibold">{t("goodPractices.summaryAsOwner")}</p>
        <ol className="pl-3">
          <li className="flex">- {t("goodPractices.summaryAsOwner1")}</li>
          <li className="flex">- {t("goodPractices.summaryAsOwner2")}</li>
          <li className="flex">- {t("goodPractices.summaryAsOwner3")}</li>
          <li className="flex">- {t("goodPractices.summaryAsOwner4")}</li>
        </ol>
      </div>
      <div>
        <h5 className="my-2 font-extrabold">
          {t("goodPractices.whatCommentsAreForbidden")}
        </h5>
        <p>{t("goodPractices.reviuGoal")}</p>
        <br />
        <p>{t("goodPractices.avoidMissuse")}</p>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.noPersonalData")}
        </h6>
        <p>{t("goodPractices.noPersonalDataIntro")}</p>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.noPersonalData1")}</strong>
              &nbsp;
              {t("goodPractices.noPersonalData1sub")}
            </span>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.noPersonalData2")}</strong>
              &nbsp;
              {t("goodPractices.noPersonalData2sub")}
            </span>
            <ol
              className=" ml-8"
            >
              <li className="mb-1">- {t("goodPractices.noPersonalData2sub1")}</li>
              <li className="mb-1">- {t("goodPractices.noPersonalData2sub2")}</li>
            </ol>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.noPersonalData3")}</strong>
              &nbsp;
              {t("goodPractices.noPersonalData3sub")}
            </span>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.noPersonalData4")}</strong>
              &nbsp;
              {t("goodPractices.noPersonalData4sub")}
            </span>
          </li>
        </ol>
        <p>{t("goodPractices.noPersonalDataExamples")}</p>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-2">{t("goodPractices.noPersonalDataExample1")}</li>
          <li className="mb-2">{t("goodPractices.noPersonalDataExample2")}</li>
          <li className="mb-2">{t("goodPractices.noPersonalDataExample3")}</li>
          <li className="mb-2">{t("goodPractices.noPersonalDataExample4")}</li>
          <li className="mb-2">{t("goodPractices.noPersonalDataExample5")}</li>
        </ol>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.noBadComments")}
        </h6>
        <p>{t("goodPractices.noBadCommentsIntro")}</p>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-2">{t("goodPractices.noBadComments1")}</li>
          <li className="mb-2">{t("goodPractices.noBadComments2")}</li>
          <li className="mb-2">{t("goodPractices.noBadComments3")}</li>
          <li className="mb-2">{t("goodPractices.noBadComments4")}</li>
        </ol>
        <p>{t("goodPractices.noBadCommentsExamples")}</p>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-2">{t("goodPractices.noBadCommentsExample1")}</li>
          <li className="mb-2">{t("goodPractices.noBadCommentsExample2")}</li>
          <li className="mb-2">{t("goodPractices.noBadCommentsExample3")}</li>
          <li className="mb-2">{t("goodPractices.noBadCommentsExample4")}</li>
          <li className="mb-2">{t("goodPractices.noBadCommentsExample5")}</li>
          <li className="mb-2">{t("goodPractices.noBadCommentsExample6")}</li>
        </ol>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.noSpamComments")}
        </h6>
        <p>{t("goodPractices.noSpamComments1")}</p>
        <br/>
        <p>{t("goodPractices.noSpamComments2")}</p>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.noDiscriminationComments")}
        </h6>
        <p>{t("goodPractices.noDiscriminationCommentsContent")}</p>
      </div>
      <div>
        <h5 className="mt-8 font-extrabold">
          {t("goodPractices.whenDeleteComments")}
        </h5>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.automaticallyDeletedComments")}
        </h6>
        <p>{t("goodPractices.automaticallyDeletedComments1")}</p>
        <br />
        <p>{t("goodPractices.automaticallyDeletedComments2")}</p>
        <br />
        <p>{t("goodPractices.automaticallyDeletedComments3")}</p>

        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.validationProcessComments")}
        </h6>
        <p>{t("goodPractices.validationprocessComments1")}</p>
        <br />
        <p>{t("goodPractices.validationProcessComments2")}</p>
        <br />
        <p>{t("goodPractices.validationProcessComments3")}</p>
      </div>
      <div>
        <h5 className="mt-8 mb-6 font-extrabold">
          {t("goodPractices.commentsOfInterest")}
        </h5>
        <p>{t("goodPractices.commentsOfInterestIntro")}</p>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.asTenant")}
        </h6>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.asTenant1")}</strong>
              {t("goodPractices.asTenant1Intro")}
            </span>
            <ol
              className="py-3 list-disc list-inside ml-8"
              style={{ listStyleType: "circle" }}
            >
              <li className="mb-2">{t("goodPractices.asTenant1a")}</li>
              <li className="mb-2">{t("goodPractices.asTenant1b")}</li>
              <li className="mb-2">{t("goodPractices.asTenant1c")}</li>
            </ol>
          </li>
          <li className="mb-3">
            <strong>{t("goodPractices.asTenant2")}</strong>
            <ol
              className="py-3 list-disc list-inside ml-8"
              style={{ listStyleType: "circle" }}
            >
              <li className="mb-2">{t("goodPractices.asTenant2a")}</li>
              <li className="mb-2">{t("goodPractices.asTenant2b")}</li>
            </ol>
          </li>
          <li className="mb-3">
            <strong>{t("goodPractices.asTenant3")}</strong>
            <ol
              className="py-3 list-disc list-inside ml-8"
              style={{ listStyleType: "circle" }}
            >
              <li className="mb-2">{t("goodPractices.asTenant3a")}</li>
              <li className="mb-2">{t("goodPractices.asTenant3b")}</li>
            </ol>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.asTenant4")}</strong>
              {t("goodPractices.asTenant4sub")}
            </span>
          </li>
        </ol>
        <h6 className="my-4 underline text-secondary-500 text-lg">
          {t("goodPractices.asOwner")}
        </h6>
        <p>{t("goodPractices.asOwnerIntro")}</p>
        <ol
          className="py-3 list-disc list-inside ml-8"
          style={{ listStyleType: "circle" }}
        >
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.asOwner1")}</strong>
              {t("goodPractices.asOwner1sub")}
            </span>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.asOwner2")}</strong>
              {t("goodPractices.asOwner2sub")}
            </span>
          </li>
          <li className="mb-3">
            <span>
              <strong>{t("goodPractices.asOwner3")}</strong>
              {t("goodPractices.asOwner3sub")}
            </span>
          </li>
          <li className="mb-3">
            <strong>{t("goodPractices.asOwner4")}</strong>
          </li>
        </ol>
      </div>
    </div>
  );
}
