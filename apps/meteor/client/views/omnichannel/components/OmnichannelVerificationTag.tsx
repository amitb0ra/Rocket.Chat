import { Box, Icon, Tag } from '@rocket.chat/fuselage';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useHasLicenseModule } from '../../../hooks/useHasLicenseModule';

type OmnichannelVerificationTagProps = {
	verified?: boolean;
	onClick?: () => void;
};

const OmnichannelVerificationTag = ({ verified, onClick }: OmnichannelVerificationTagProps) => {
	const { t } = useTranslation();
	const hasLicense = useHasLicenseModule('contact-id-verification') as boolean;
	const isVerified = hasLicense && verified;

	return (
		<Box mis={4} withTruncatedText>
			<Tag
				variant={isVerified ? 'primary' : undefined}
				onClick={!isVerified && onClick ? onClick : undefined}
				icon={<Icon size='x12' mie={4} name={isVerified ? 'success-circle' : 'question-mark'} />}
			>
				{isVerified ? t('Verified') : t('Unverified')}
			</Tag>
		</Box>
	);
};

export default OmnichannelVerificationTag;
