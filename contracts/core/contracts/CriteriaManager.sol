/**
 * SPDX-License-Identifier: Apache-2.0
 */
pragma solidity 0.8.4;
import { OtokenInterface } from "./packages/opynInterface/OtokenInterface.sol";
import { ICriteriaManager } from "./interfaces/ICriteriaManager.sol";

/**
 * @title CriteriaManager
 * @notice Keeps a registry of all Criteria and CriteriaSet instances that are know to the Potion protocol.
 */
contract CriteriaManager is ICriteriaManager {
    /// @dev the (non-enumerable) Criteria instances that are known to us, indexed by the hash of the struct
    mapping(bytes32 => bool) public registeredCriteria;
    /// @dev the (non-enumerable) CriteriaSet instances that are known to us, indexed by the hash of the *ordered* list of Criteria hashes in the CriteriaSet
    mapping(bytes32 => CriteriaSet) public criteriaSetByHash;

    ///////////////////////////////////////////////////////////////////////////
    //  Public interfaces
    ///////////////////////////////////////////////////////////////////////////

    /**
     * @notice Add the specified set of Criteria to the registry of CriteriaSets that are known to our contract.
     * @param _hashes A sorted list of bytes32 values, each being the hash of a known Criteria. No duplicates, so this can be considered a set.
     * @return criteriaSetHash The identifier for this criteria set.
     */
    function addCriteriaSet(bytes32[] calldata _hashes) external override returns (bytes32 criteriaSetHash) {
        criteriaSetHash = hashOfSortedHashes(_hashes);
        if (!isCriteriaSetHash(criteriaSetHash)) {
            uint256 inputLength = _hashes.length;
            require(inputLength > 0, "empty set");
            CriteriaSet storage cs = criteriaSetByHash[criteriaSetHash];
            cs.exists = true;
            for (uint256 i = 0; i < inputLength; i++) {
                // In the unlikely event that gas costs prove prohibitive, use a smaller list!
                // (If gas limits reduce, any large existing sets can still be used.)
                require(registeredCriteria[_hashes[i]], "Unrecognised hash");
                require(!cs.hashes[_hashes[i]], "Duplicated input hash");
                cs.hashes[_hashes[i]] = true;
            }
            emit CriteriaSetAdded(criteriaSetHash, _hashes);
        }
        return criteriaSetHash;
    }

    /**
     * @notice Check whether the specified hash is the hash of a CriteriaSet that is known to our contract.
     * @param _criteriaSetHash The hash to look for.
     * @return valid True if the hash is that of a known CriteriaSet; false if it is not.
     */
    function isCriteriaSetHash(bytes32 _criteriaSetHash) public view override returns (bool valid) {
        return criteriaSetByHash[_criteriaSetHash].exists;
    }

    /**
     * @notice Add the specified Criteria to the registry of Criteria that are known to our contract.
     * @param _criteria The Criteria to register.
     * @return hash The keccak256 of the Criteria.
     */
    function addCriteria(Criteria calldata _criteria)
        external
        override
        onlyValidCriteria(_criteria)
        returns (bytes32 hash)
    {
        hash = hashCriteria(_criteria);
        if (!registeredCriteria[hash]) {
            // Does not already exist
            registeredCriteria[hash] = true;
            emit CriteriaAdded(hash, _criteria);
        }
        return hash;
    }

    /**
     * @notice Get the hash of given Criteria
     * @param _criteria The Criteria to be hashed.
     * @return The keccak256 hash of the Criteria.
     */
    function hashCriteria(Criteria calldata _criteria) public pure override returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    _criteria.underlyingAsset,
                    _criteria.strikeAsset,
                    _criteria.isPut,
                    _criteria.maxStrikePercent,
                    _criteria.maxDurationInDays
                )
            );
    }

    /**
     * @notice Get the hash of an ordered list of hash values.
     * @param _hashes The list of bytes32 values to be hashed. This list must be sorted according to solidity's ordering, and must not contain any duplicate values.
     * @return The keccak256 hash of the set of hashes.
     */
    function hashOfSortedHashes(bytes32[] calldata _hashes) public pure override returns (bytes32) {
        if (_hashes.length > 1) {
            for (uint256 i = 1; i < _hashes.length; i++) {
                // In the unlikely event that gas costs prove prohibitive, use a smaller list!
                // (If gas limits reduce, existing sets can still be used.)
                require(_hashes[i] > _hashes[i - 1], "Input hashes not sorted");
            }
        }
        return keccak256(abi.encodePacked(_hashes));
    }

    /**
     * @notice Check whether the specified Criteria hash exists within the specified CriteriaSet.
     * @dev Clients should be responsible of passing correct parameters(_criteriaSetHash and _criteriaHash), otherwise we revert.
     * @param _criteriaSetHash The criteria list to be checked.
     * @param _criteriaHash The criteria we are looking for on that list.
     * @return isInSet true if the criteria exists in the criteriaSet; false if it does not.
     */
    function isInCriteriaSet(bytes32 _criteriaSetHash, bytes32 _criteriaHash)
        external
        view
        override
        returns (bool isInSet)
    {
        require(isCriteriaSetHash(_criteriaSetHash), "no such list");
        require(registeredCriteria[_criteriaHash], "no such criteria registered");
        return criteriaSetByHash[_criteriaSetHash].hashes[_criteriaHash];
    }

    /**
     * @notice Check that a given token matches some specific Criteria.
     * @param _criteria The criteria to be checked against
     * @param _otokenCache The otoken to check
     */
    function requireOtokenMeetsCriteria(Criteria calldata _criteria, OtokenProperties calldata _otokenCache)
        external
        pure
        override
    {
        require(_criteria.underlyingAsset == _otokenCache.underlyingAsset, "wrong underlying token");
        require(_criteria.strikeAsset == _otokenCache.strikeAsset, "wrong strike token");
        require(_criteria.isPut == _otokenCache.isPut, "call options not supported");
        require(_criteria.maxStrikePercent >= _otokenCache.percentStrikeValue, "invalid strike%");
        require(_criteria.maxDurationInDays >= _otokenCache.wholeDaysRemaining, "invalid duration");
    }

    /// @dev Neither a zero maxDuration nor a zero maxStrikePercent makes any sense
    modifier onlyValidCriteria(Criteria calldata _criteria) {
        require(_criteria.maxDurationInDays > 0, "Invalid duration");
        require(_criteria.maxStrikePercent > 0, "Invalid strike%");
        _;
    }
}
